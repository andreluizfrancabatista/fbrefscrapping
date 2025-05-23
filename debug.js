const puppeteer = require('puppeteer');

async function debugPage(url) {
    console.log('🔍 Iniciando debug da página...');
    
    const browser = await puppeteer.launch({
        headless: false, // Mostrar navegador para debug visual
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--start-maximized'
        ]
    });

    const page = await browser.newPage();
    
    // Configurar User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    try {
        console.log(`📡 Acessando: ${url}`);
        await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('📊 Analisando estrutura da página...');
        
        const pageInfo = await page.evaluate(() => {
            const info = {
                title: document.title,
                url: window.location.href,
                tables: [],
                possibleScheduleElements: []
            };

            // Analisar todas as tabelas
            const tables = document.querySelectorAll('table');
            tables.forEach((table, i) => {
                const rows = table.querySelectorAll('tr');
                const firstRowCells = rows[0] ? rows[0].querySelectorAll('td, th') : [];
                
                info.tables.push({
                    index: i,
                    className: table.className,
                    id: table.id,
                    rows: rows.length,
                    firstRowText: firstRowCells.length > 0 ? 
                        Array.from(firstRowCells).map(cell => cell.textContent.trim()).join(' | ') : '',
                    hasDataStats: table.querySelector('[data-stat]') !== null
                });
            });

            // Procurar elementos com texto relacionado a jogos
            const gameKeywords = ['vs', 'v', '–', '-', 'fixtures', 'schedule', 'matches'];
            document.querySelectorAll('*').forEach(el => {
                const text = el.textContent;
                if (gameKeywords.some(keyword => text.toLowerCase().includes(keyword)) && 
                    text.length < 100 && text.length > 5) {
                    info.possibleScheduleElements.push({
                        tagName: el.tagName,
                        className: el.className,
                        id: el.id,
                        text: text.trim()
                    });
                }
            });

            // Limitar elementos encontrados
            info.possibleScheduleElements = info.possibleScheduleElements.slice(0, 10);

            return info;
        });

        console.log('\n📋 INFORMAÇÕES DA PÁGINA:');
        console.log(`Título: ${pageInfo.title}`);
        console.log(`URL: ${pageInfo.url}`);
        
        console.log('\n📊 TABELAS ENCONTRADAS:');
        pageInfo.tables.forEach(table => {
            console.log(`\nTabela ${table.index}:`);
            console.log(`  Classe: "${table.className}"`);
            console.log(`  ID: "${table.id}"`);
            console.log(`  Linhas: ${table.rows}`);
            console.log(`  Primeira linha: ${table.firstRowText}`);
            console.log(`  Tem data-stat: ${table.hasDataStats}`);
        });

        console.log('\n🎯 ELEMENTOS COM POSSÍVEIS JOGOS:');
        pageInfo.possibleScheduleElements.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tagName}.${el.className}#${el.id}: "${el.text}"`);
        });

        // Fazer screenshot
        await page.screenshot({ path: 'debug-full-page.png', fullPage: true });
        console.log('\n📸 Screenshot salvo como debug-full-page.png');

        // Tentar encontrar dados específicos na primeira tabela com mais linhas
        const mainTable = pageInfo.tables.find(t => t.rows > 5);
        if (mainTable) {
            console.log(`\n🔍 Analisando tabela principal (índice ${mainTable.index}):`);
            
            const tableData = await page.evaluate((tableIndex) => {
                const table = document.querySelectorAll('table')[tableIndex];
                const rows = table.querySelectorAll('tr');
                const sampleData = [];
                
                // Pegar primeiras 5 linhas como amostra
                for (let i = 0; i < Math.min(5, rows.length); i++) {
                    const row = rows[i];
                    const cells = row.querySelectorAll('td, th');
                    const cellData = Array.from(cells).map(cell => ({
                        text: cell.textContent.trim(),
                        dataStat: cell.getAttribute('data-stat'),
                        className: cell.className
                    }));
                    sampleData.push(cellData);
                }
                
                return sampleData;
            }, mainTable.index);

            console.log('Amostra dos dados da tabela:');
            tableData.forEach((row, i) => {
                console.log(`\nLinha ${i}:`);
                row.forEach((cell, j) => {
                    if (cell.text) {
                        console.log(`  Célula ${j}: "${cell.text}" (data-stat: ${cell.dataStat})`);
                    }
                });
            });
        }

        console.log('\n⏳ Página ficará aberta por 30 segundos para inspeção manual...');
        await new Promise(resolve => setTimeout(resolve, 30000));

    } catch (error) {
        console.error('❌ Erro durante debug:', error);
    } finally {
        await browser.close();
    }
}

// Executar debug
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('Uso: node debug.js <url>');
        console.error('Exemplo: node debug.js "https://fbref.com/en/comps/9/schedule/Premier-League-Scores-and-Fixtures"');
        process.exit(1);
    }

    const url = args[0];
    await debugPage(url);
}

if (require.main === module) {
    main();
}