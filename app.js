const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cache simples para evitar re-execução desnecessária
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para descobrir ligas disponíveis
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
                    
                    leagues.push({
                        id: baseName,
                        country: country,
                        league: league.replace(/_/g, ' '),
                        displayName: `${country} - ${league.replace(/_/g, ' ')}`,
                        compNumber: parseInt(compNumber)
                    });
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
            console.log(`Python script finished with code: ${code}`);
            console.log('Python output length:', output.length);
            
            if (code === 0) {
                resolve(output);
            } else {
                console.error('Python stderr:', errorOutput);
                reject(new Error(`Python script failed: ${errorOutput || 'Unknown error'}`));
            }
        });

        python.on('error', (error) => {
            console.error('Failed to start Python process:', error);
            reject(new Error(`Failed to start Python: ${error.message}`));
        });

        // Timeout de 60 segundos (aumentado)
        setTimeout(() => {
            python.kill();
            reject(new Error('Python script timeout (60s)'));
        }, 60000);
    });
}

// Função para parsear a saída do Python
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

        // Detectar início/fim das seções usando markers
        if (line === 'RANKING_START') {
            currentSection = 'rankings';
            inDataSection = false;
            continue;
        } else if (line === 'RANKING_END') {
            currentSection = '';
            inDataSection = false;
            continue;
        } else if (line === 'NEXT_GAMES_START') {
            currentSection = 'nextGames';
            inDataSection = false;
            continue;
        } else if (line === 'NEXT_GAMES_END') {
            currentSection = '';
            inDataSection = false;
            continue;
        } else if (line === 'HIGHLIGHTED_GAMES_START') {
            currentSection = 'highlighted';
            inDataSection = false;
            continue;
        } else if (line === 'HIGHLIGHTED_GAMES_END') {
            currentSection = '';
            inDataSection = false;
            continue;
        } else if (line === 'CAMPAIGN_ENDED') {
            result.campaignEnded = true;
            continue;
        }

        // Parse rankings
        if (currentSection === 'rankings' && line.match(/^\d+\./)) {
            const match = line.match(/^(\d+)\.\s+(.+?)\s+=\s+([-\d.]+)$/);
            if (match) {
                result.rankings.push({
                    position: parseInt(match[1]),
                    team: match[2].trim(),
                    strength: parseFloat(match[3])
                });
            }
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
                    // Parse usando posições fixas da tabela formatada
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
                    console.log('Erro ao parsear linha de next games:', line);
                }
            }
        }

        // Parse highlighted games
        if (currentSection === 'highlighted') {
            if (line.includes('WEEK') && line.includes('DATE') && line.includes('HOME')) {
                inDataSection = true;
                continue;
            }
            if (line.startsWith('---')) {
                continue;
            }
            if (inDataSection && line.length > 20) {
                try {
                    // Parse usando posições fixas da tabela formatada
                    const week = line.substring(0, 6).trim();
                    const date = line.substring(6, 18).trim();
                    const time = line.substring(18, 26).trim();
                    const home = line.substring(26, 46).trim();
                    const away = line.substring(46, 66).trim();
                    const homeScore = parseFloat(line.substring(66, 78).trim());
                    const awayScore = parseFloat(line.substring(78, 90).trim());
                    const predictedDiff = parseFloat(line.substring(90).trim());

                    if (!isNaN(homeScore) && !isNaN(awayScore) && !isNaN(predictedDiff)) {
                        result.highlightedGames.push({
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
                    console.log('Erro ao parsear linha de highlighted games:', line);
                }
            }
        }
    }

    console.log('Parsing result:', {
        rankings: result.rankings.length,
        nextGames: result.nextGames.length,
        highlightedGames: result.highlightedGames.length,
        campaignEnded: result.campaignEnded
    });

    return result;
}

// Função para obter jogos destacados de todas as ligas
async function getAllHighlightedGames(threshold = 1.5) {
    const leagues = getAvailableLeagues();
    const allHighlightedGames = [];

    for (const league of leagues) {
        try {
            const cacheKey = `analysis_${league.id}`;
            let analysisData;

            if (cache.has(cacheKey)) {
                const cached = cache.get(cacheKey);
                if (Date.now() - cached.timestamp < CACHE_DURATION) {
                    analysisData = cached.data;
                } else {
                    cache.delete(cacheKey);
                }
            }

            if (!analysisData) {
                const output = await runPythonScript(league.id);
                analysisData = parseAnalysisOutput(output);
                cache.set(cacheKey, {
                    data: analysisData,
                    timestamp: Date.now()
                });
            }

            // Filtrar jogos com base no threshold
            const filteredGames = analysisData.nextGames.filter(game => 
                Math.abs(game.predictedDiff) >= threshold
            );

            filteredGames.forEach(game => {
                allHighlightedGames.push({
                    ...game,
                    league: league.displayName,
                    leagueId: league.id
                });
            });

        } catch (error) {
            console.error(`Erro ao processar liga ${league.id}:`, error.message);
        }
    }

    // Ordenar por diferença prevista (maior primeiro)
    allHighlightedGames.sort((a, b) => Math.abs(b.predictedDiff) - Math.abs(a.predictedDiff));

    return allHighlightedGames;
}

// Rotas da API

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listar ligas disponíveis
app.get('/api/leagues', (req, res) => {
    try {
        const leagues = getAvailableLeagues();
        res.json({
            success: true,
            leagues: leagues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao carregar ligas disponíveis'
        });
    }
});

// Analisar liga específica
app.post('/api/analyze', async (req, res) => {
    const { leagueId } = req.body;

    if (!leagueId) {
        return res.status(400).json({
            success: false,
            error: 'ID da liga é obrigatório'
        });
    }

    try {
        // Verificar cache
        const cacheKey = `analysis_${leagueId}`;
        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_DURATION) {
                return res.json({
                    success: true,
                    data: cached.data,
                    cached: true
                });
            } else {
                cache.delete(cacheKey);
            }
        }

        const output = await runPythonScript(leagueId);
        const analysisData = parseAnalysisOutput(output);

        // Salvar no cache
        cache.set(cacheKey, {
            data: analysisData,
            timestamp: Date.now()
        });

        res.json({
            success: true,
            data: analysisData,
            cached: false
        });

    } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// Obter todos os jogos destacados (agora lê do arquivo JSON)
app.get('/api/highlighted-games', async (req, res) => {
    const threshold = parseFloat(req.query.threshold) || 1.5;

    try {
        const weeklyFilePath = path.join(__dirname, 'public', 'weekly-games.json');
        
        // Verificar se o arquivo existe
        if (!fs.existsSync(weeklyFilePath)) {
            return res.status(404).json({
                success: false,
                error: 'Arquivo de jogos da semana não encontrado. Execute: node generate-weekly.js'
            });
        }

        // Ler arquivo JSON
        const weeklyData = JSON.parse(fs.readFileSync(weeklyFilePath, 'utf8'));
        
        // Filtrar jogos com base no threshold
        const filteredGames = weeklyData.games.filter(game => 
            Math.abs(game.predictedDiff) >= threshold
        );

        res.json({
            success: true,
            games: filteredGames,
            threshold: threshold,
            count: filteredGames.length,
            lastUpdate: weeklyData.lastUpdate,
            totalGames: weeklyData.totalGames,
            totalLeagues: weeklyData.totalLeagues
        });

    } catch (error) {
        console.error('Erro ao obter jogos destacados:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao carregar jogos destacados: ' + error.message
        });
    }
});

// Regenerar jogos da semana
app.post('/api/regenerate-weekly', async (req, res) => {
    try {
        const { generateWeeklyGames } = require('./generate-weekly');
        
        // Executar geração em background
        generateWeeklyGames()
            .then(() => {
                console.log('✅ Jogos da semana regenerados com sucesso');
            })
            .catch((error) => {
                console.error('❌ Erro ao regenerar jogos da semana:', error);
            });

        // Responder imediatamente
        res.json({
            success: true,
            message: 'Regeneração iniciada em background'
        });

    } catch (error) {
        console.error('Erro ao iniciar regeneração:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao iniciar regeneração'
        });
    }
});

// Filtrar jogos destacados por threshold
app.post('/api/filter-highlighted', (req, res) => {
    const { games, threshold } = req.body;

    if (!games || threshold === undefined) {
        return res.status(400).json({
            success: false,
            error: 'Dados incompletos'
        });
    }

    const filteredGames = games.filter(game => 
        Math.abs(game.predictedDiff) >= threshold
    );

    res.json({
        success: true,
        games: filteredGames,
        threshold: threshold,
        count: filteredGames.length
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Soccer Analytics Web App iniciado!`);
});