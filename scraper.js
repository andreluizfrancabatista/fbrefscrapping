const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Função para converter data de YYYYMMDD para DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString || dateString.length !== 8) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`;
}

// Função para converter horário de hh:mm:ss para hh:mm
function formatTime(timeString) {
    if (!timeString || timeString.length < 5) return '';
    return timeString.substring(0, 5);
}

// Função para converter array de objetos para CSV
function arrayToCSV(data, separator = ';') {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(separator),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Se o valor contém o separador, aspas ou quebras de linha, envolver em aspas
                if (typeof value === 'string' && (value.includes(separator) || value.includes('"') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(separator)
        )
    ].join('\n');

    return csvContent;
}

// Função principal de scraping
async function scrapeSoccerData(pais, liga, link) {
    let browser;
    let page;

    try {
        console.log('Iniciando o navegador...');

        // Configurações do Puppeteer
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--start-maximized',
                '--ignore-certificate-errors',
                '--disable-crash-reporter',
                '--disable-gpu',
                '--enable-unsafe-swiftshader',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });

        page = await browser.newPage();

        // Configurar User-Agent para evitar bloqueios
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Configurar viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Navegar para a página
        console.log(`Acessando: ${link}`);
        await page.goto(link, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Aguardar elementos específicos carregarem
        console.log('Aguardando tabela carregar...');
        try {
            await page.waitForSelector('table.stats_table', { timeout: 15000 });
            console.log('Tabela encontrada!');
        } catch (error) {
            console.log('Tentando seletores alternativos...');
            const alternatives = [
                'table[class*="stats"]',
                'table[id*="schedule"]',
                'table[class*="table"]',
                '.table_wrapper table',
                'div[id*="div_sched"] table'
            ];

            let tableFound = false;
            for (const selector of alternatives) {
                try {
                    await page.waitForSelector(selector, { timeout: 5000 });
                    console.log(`Tabela encontrada com seletor: ${selector}`);
                    tableFound = true;
                    break;
                } catch (e) {
                    continue;
                }
            }

            if (!tableFound) {
                // Fazer screenshot para debug
                await page.screenshot({ path: 'debug-page.png', fullPage: true });
                console.log('Screenshot salvo como debug-page.png para análise');
                throw new Error('Nenhuma tabela encontrada na página');
            }
        }

        // Aguardar mais um pouco para garantir que o conteúdo carregou
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Coletando dados da tabela...');

        // Extrair dados da tabela
        const data = await page.evaluate(() => {
            const dados = {
                WEEK: [],
                DATE: [],
                TIME: [],
                HOME: [],
                AWAY: [],
                FTHG: [],
                FTAG: [],
                DIFF: []
            };

            const next = {
                WEEK: [],
                DATE: [],
                TIME: [],
                HOME: [],
                AWAY: []
            };

            console.log('Iniciando extração de dados...');

            try {
                // Tentar diferentes seletores para a tabela
                let table = document.querySelector('table.stats_table');

                if (!table) {
                    const alternatives = [
                        'table[class*="stats"]',
                        'table[id*="schedule"]',
                        'table[class*="table"]',
                        '.table_wrapper table',
                        'div[id*="div_sched"] table'
                    ];

                    for (const selector of alternatives) {
                        table = document.querySelector(selector);
                        if (table) {
                            console.log(`Tabela encontrada com seletor: ${selector}`);
                            break;
                        }
                    }
                }

                if (!table) {
                    console.error('Nenhuma tabela encontrada');
                    console.log('Tabelas disponíveis na página:');
                    const allTables = document.querySelectorAll('table');
                    allTables.forEach((t, i) => {
                        console.log(`Tabela ${i}: class="${t.className}", id="${t.id}"`);
                    });
                    throw new Error('Tabela não encontrada');
                }

                console.log(`Tabela encontrada: ${table.className || table.id}`);
                const rows = table.querySelectorAll('tr');
                console.log(`Total de linhas encontradas: ${rows.length}`);

                let processedRows = 0;

                rows.forEach((row, index) => {
                    try {
                        // Tentar diferentes seletores para os dados
                        let weekElement = row.querySelector('th[data-stat="gameweek"]') ||
                            row.querySelector('td[data-stat="gameweek"]');

                        let dateElement = row.querySelector('td[data-stat="date"]');
                        let timeElement = row.querySelector('td[data-stat="start_time"]');
                        let homeElement = row.querySelector('td[data-stat="home_team"]');
                        let awayElement = row.querySelector('td[data-stat="away_team"]');
                        let scoreElement = row.querySelector('td[data-stat="score"]');

                        if (!weekElement || !dateElement || !homeElement || !awayElement) {
                            return; // Pula esta linha se elementos essenciais não existirem
                        }

                        const week = weekElement.textContent.trim();
                        // Melhorar extração de data - tentar csk primeiro, depois textContent
                        const date = dateElement.getAttribute('csk') || dateElement.textContent.trim();
                        // Melhorar extração de hora - pode não existir
                        const time = timeElement ? (timeElement.getAttribute('csk') || timeElement.textContent.trim()) : '';
                        const home = homeElement.textContent.trim();
                        const away = awayElement.textContent.trim();
                        const score = scoreElement ? scoreElement.textContent.trim() : '';

                        // Validar se temos dados válidos
                        if (!week || !home || !away) {
                            return;
                        }

                        console.log(`Linha ${index}: ${home} vs ${away} - Score: "${score}"`);

                        if (!score || score === '' || score === '–' || score === '-') {
                            // Jogo futuro (sem placar)
                            next.WEEK.push(week);
                            next.DATE.push(date);
                            next.TIME.push(time);
                            next.HOME.push(home);
                            next.AWAY.push(away);
                            console.log(`Próximo jogo: ${home} vs ${away}`);
                        } else {
                            // Jogo já realizado (com placar)
                            const scoreParts = score.split(/[–-]/);
                            if (scoreParts.length === 2) {
                                const fthg = scoreParts[0].trim();
                                const ftag = scoreParts[1].trim();

                                // Verificar se são números válidos
                                if (!isNaN(fthg) && !isNaN(ftag)) {
                                    const diff = parseInt(fthg) - parseInt(ftag);

                                    dados.WEEK.push(week);
                                    dados.DATE.push(date);
                                    dados.TIME.push(time);
                                    dados.HOME.push(home);
                                    dados.AWAY.push(away);
                                    dados.FTHG.push(fthg);
                                    dados.FTAG.push(ftag);
                                    dados.DIFF.push(diff);

                                    console.log(`Jogo processado: ${home} ${fthg}-${ftag} ${away}`);
                                    processedRows++;
                                }
                            }
                        }
                    } catch (error) {
                        console.log(`Erro na linha ${index}: ${error.message}`);
                    }
                });

                console.log(`Total de jogos processados: ${processedRows}`);
                console.log(`Jogos realizados: ${dados.WEEK.length}`);
                console.log(`Próximos jogos: ${next.WEEK.length}`);

            } catch (error) {
                console.error('Erro ao processar tabela:', error);
            }

            return { dados, next };
        });

        // Processar e salvar dados dos jogos realizados
        console.log('Processando dados dos jogos realizados...');
        console.log(`Dados coletados - Jogos: ${data.dados.WEEK.length}, Próximos: ${data.next.WEEK.length}`);

        // Debug apenas se não conseguiu coletar dados
        if (data.dados.WEEK.length === 0 && data.next.WEEK.length === 0) {
            console.log('⚠️  Nenhum dado foi coletado. Fazendo debug...');

            try {
                // Fazer screenshot para debug
                await page.screenshot({ path: 'debug-no-data.png', fullPage: true });
                console.log('Screenshot de debug salvo como debug-no-data.png');

                // Mostrar HTML da página para debug
                const htmlContent = await page.content();
                console.log('Primeiros 500 caracteres do HTML:');
                console.log(htmlContent.substring(0, 500));

                // Tentar encontrar tabelas na página
                const tablesInfo = await page.evaluate(() => {
                    const tables = document.querySelectorAll('table');
                    return Array.from(tables).map((table, i) => ({
                        index: i,
                        className: table.className,
                        id: table.id,
                        rows: table.querySelectorAll('tr').length
                    }));
                });

                console.log('Tabelas encontradas na página:', tablesInfo);
            } catch (debugError) {
                console.log('Erro no debug:', debugError.message);
            }
        }

        // Processar dados dos jogos realizados
        const processedData = data.dados.WEEK.map((week, index) => ({
            WEEK: week,
            DATE: formatDate(data.dados.DATE[index]),
            TIME: formatTime(data.dados.TIME[index]),
            HOME: data.dados.HOME[index],
            AWAY: data.dados.AWAY[index],
            FTHG: data.dados.FTHG[index],
            FTAG: data.dados.FTAG[index],
            DIFF: data.dados.DIFF[index]
        }));

        // Extrair o número da competição da URL para usar como prefixo
        function extractCompNumber(url) {
            const match = url.match(/\/comps\/(\d+)\//);
            return match ? match[1].padStart(3, '0') : '999';
        }

        const compNumber = extractCompNumber(link);
        console.log(`Número da competição extraído: ${compNumber}`);

        // Criar diretório data se não existir
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Salvar arquivo principal com prefixo numérico
        const mainFilename = path.join(dataDir, `${compNumber}-${pais}-${liga}.csv`);
        const mainCsv = arrayToCSV(processedData);
        fs.writeFileSync(mainFilename, mainCsv, 'utf8');
        console.log(`Dados salvos em: ${mainFilename}`);

        // Processar e salvar dados dos próximos jogos (primeiros 10)
        console.log('Processando dados dos próximos jogos...');
        const nextGamesData = data.next.WEEK.slice(0, 10).map((week, index) => ({
            WEEK: week,
            DATE: formatDate(data.next.DATE[index]),
            TIME: formatTime(data.next.TIME[index]),
            HOME: data.next.HOME[index],
            AWAY: data.next.AWAY[index]
        }));

        // Salvar arquivo dos próximos jogos com prefixo numérico
        const nextFilename = path.join(dataDir, `${compNumber}-${pais}-${liga}_next.csv`);
        const nextCsv = arrayToCSV(nextGamesData);
        fs.writeFileSync(nextFilename, nextCsv, 'utf8');
        console.log(`Próximos jogos salvos em: ${nextFilename}`);

        console.log('Scraping concluído com sucesso!');

        return {
            mainFile: mainFilename,
            nextFile: nextFilename,
            totalGames: processedData.length,
            nextGames: nextGamesData.length
        };

    } catch (error) {
        console.error('Erro durante o scraping:', error);
        throw error;
    } finally {
        // Garantir que o browser seja fechado apenas no final
        if (browser) {
            try {
                await browser.close();
                console.log('Browser fechado com sucesso.');
            } catch (closeError) {
                console.log('Erro ao fechar browser:', closeError.message);
            }
        }
    }
}

// Função principal para executar o script
async function main() {
    try {
        // Verificar argumentos da linha de comando
        const args = process.argv.slice(2);

        if (args.length < 3) {
            console.error('Uso: node scraper.js <pais> <liga> <link>');
            console.error('Exemplo: node scraper.js Brazil Serie-A "https://fbref.com/pt/comps/24/Serie-A-Stats"');
            process.exit(1);
        }

        const [pais, liga, link] = args;

        console.log(`Iniciando scraping para: ${pais} - ${liga}`);
        console.log(`URL: ${link}`);

        const result = await scrapeSoccerData(pais, liga, link);

        console.log('\n=== RESUMO ===');
        console.log(`País: ${pais}`);
        console.log(`Liga: ${liga}`);
        console.log(`Jogos coletados: ${result.totalGames}`);
        console.log(`Próximos jogos: ${result.nextGames}`);
        console.log(`Arquivo principal: ${result.mainFile}`);
        console.log(`Arquivo próximos jogos: ${result.nextFile}`);

    } catch (error) {
        console.error('Erro na execução:', error);
        process.exit(1);
    }
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { scrapeSoccerData };