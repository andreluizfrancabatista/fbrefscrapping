const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para descobrir ligas disponíveis (ATUALIZADA para novos nomes de arquivo)
function getAvailableLeagues() {
    const dataDir = path.join(__dirname, 'data');
    
    if (!fs.existsSync(dataDir)) {
        return [];
    }

    try {
        const files = fs.readdirSync(dataDir);
        // Filtrar arquivos principais (com prefixo numérico, sem _next)
        const mainFiles = files.filter(file => 
            file.endsWith('.csv') && 
            !file.endsWith('_next.csv') &&
            file.match(/^\d{3}-/)  // Começar com 3 dígitos seguidos de hífen
        );

        const leagues = [];
        
        mainFiles.forEach(file => {
            const baseName = file.replace('.csv', '');
            const nextFile = `${baseName}_next.csv`;
            
            if (files.includes(nextFile)) {
                // Extrair compNumber, país e liga do novo formato: "009-ENG-Premier_League.csv"
                const match = baseName.match(/^(\d{3})-(.+?)-(.+)$/);
                if (match) {
                    const [, compNumber, country, league] = match;
                    
                    // Verificar se o arquivo next não está vazio
                    const nextFilePath = path.join(dataDir, nextFile);
                    const stats = fs.statSync(nextFilePath);
                    if (stats.size > 100) { // Arquivo com pelo menos 100 bytes (tem dados)
                        leagues.push({
                            id: baseName,
                            country: country,
                            league: league.replace(/_/g, ' '),
                            displayName: `${country} - ${league.replace(/_/g, ' ')}`,
                            compNumber: parseInt(compNumber)
                        });
                    }
                }
            }
        });

        return leagues.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } catch (error) {
        console.error('Erro ao ler diretório data:', error);
        return [];
    }
}

// Função para executar o script Python
function runPythonScript(leagueId) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['chance.py', leagueId], {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
            cwd: __dirname
        });
        
        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            output += data.toString('utf8');
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString('utf8');
        });

        python.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Python script failed: ${errorOutput || 'Unknown error'}`));
            }
        });

        python.on('error', (error) => {
            reject(new Error(`Failed to start Python: ${error.message}`));
        });

        // Timeout de 60 segundos
        setTimeout(() => {
            python.kill();
            reject(new Error('Python script timeout'));
        }, 60000);
    });
}

// Função para parsear a saída do Python (mesma do app.js)
function parseAnalysisOutput(output) {
    const lines = output.split('\n');
    const result = {
        rankings: [],
        nextGames: [],
        highlightedGames: [],
        campaignEnded: false
    };

    let currentSection = '';
    let inDataSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === 'NEXT_GAMES_START') {
            currentSection = 'nextGames';
            inDataSection = false;
            continue;
        } else if (line === 'NEXT_GAMES_END') {
            currentSection = '';
            inDataSection = false;
            continue;
        } else if (line === 'CAMPAIGN_ENDED') {
            result.campaignEnded = true;
            continue;
        }

        // Parse next games
        if (currentSection === 'nextGames') {
            if (line.includes('WEEK') && line.includes('DATE') && line.includes('HOME')) {
                inDataSection = true;
                continue;
            }
            if (line.startsWith('---')) {
                continue;
            }
            if (inDataSection && line.length > 20) {
                try {
                    const week = line.substring(0, 6).trim();
                    const date = line.substring(6, 18).trim();
                    const time = line.substring(18, 26).trim();
                    const home = line.substring(26, 46).trim();
                    const away = line.substring(46, 66).trim();
                    const homeScore = parseFloat(line.substring(66, 78).trim());
                    const awayScore = parseFloat(line.substring(78, 90).trim());
                    const predictedDiff = parseFloat(line.substring(90).trim());

                    if (!isNaN(homeScore) && !isNaN(awayScore) && !isNaN(predictedDiff)) {
                        result.nextGames.push({
                            week: week,
                            date: date,
                            time: time,
                            home: home,
                            away: away,
                            homeScore: homeScore,
                            awayScore: awayScore,
                            predictedDiff: predictedDiff
                        });
                    }
                } catch (error) {
                    console.log('Erro ao parsear linha:', line);
                }
            }
        }
    }

    return result;
}

// Função principal para gerar jogos da semana
async function generateWeeklyGames() {
    console.log('🚀 Iniciando geração dos jogos da semana...');
    
    const startTime = Date.now();
    const leagues = getAvailableLeagues();
    const allGames = [];
    let processedLeagues = 0;
    let errorCount = 0;

    console.log(`📋 Encontradas ${leagues.length} ligas para processar`);

    for (const league of leagues) {
        try {
            console.log(`⚽ Processando: ${league.displayName}`);
            
            const output = await runPythonScript(league.id);
            const analysisData = parseAnalysisOutput(output);

            // Adicionar todos os próximos jogos com informação da liga
            analysisData.nextGames.forEach(game => {
                allGames.push({
                    ...game,
                    league: league.displayName,
                    leagueId: league.id,
                    country: league.country,
                    leagueName: league.league
                });
            });

            processedLeagues++;
            console.log(`✅ ${league.displayName}: ${analysisData.nextGames.length} jogos encontrados`);

        } catch (error) {
            console.error(`❌ Erro ao processar ${league.displayName}:`, error.message);
            errorCount++;
        }

        // Pequena pausa para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Preparar dados finais
    const weeklyData = {
        lastUpdate: new Date().toISOString(),
        totalGames: allGames.length,
        totalLeagues: processedLeagues,
        errors: errorCount,
        games: allGames.sort((a, b) => Math.abs(b.predictedDiff) - Math.abs(a.predictedDiff)) // Ordenar por diferença
    };

    // Salvar arquivo JSON
    const outputPath = path.join(__dirname, 'public', 'weekly-games.json');
    fs.writeFileSync(outputPath, JSON.stringify(weeklyData, null, 2), 'utf8');

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n📊 RESUMO DA GERAÇÃO:');
    console.log('='.repeat(50));
    console.log(`⏱️  Tempo total: ${duration} segundos`);
    console.log(`📈 Ligas processadas: ${processedLeagues}/${leagues.length}`);
    console.log(`⚽ Total de jogos: ${allGames.length}`);
    console.log(`❌ Erros: ${errorCount}`);
    console.log(`📁 Arquivo salvo: ${outputPath}`);

    // Estatísticas por threshold
    const thresholds = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
    console.log('\n📊 JOGOS POR THRESHOLD:');
    thresholds.forEach(threshold => {
        const count = allGames.filter(game => Math.abs(game.predictedDiff) >= threshold).length;
        console.log(`   Diff >= ${threshold}: ${count} jogos`);
    });

    if (errorCount === 0) {
        console.log('\n🎉 Todos os dados foram processados com sucesso!');
    } else {
        console.log(`\n⚠️  ${errorCount} erro(s) encontrado(s).`);
    }

    return weeklyData;
}

// Executar se chamado diretamente
if (require.main === module) {
    generateWeeklyGames()
        .then(() => {
            console.log('✅ Geração concluída!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro na geração:', error);
            process.exit(1);
        });
}

module.exports = { generateWeeklyGames, getAvailableLeagues };