const { spawn } = require('child_process');
const path = require('path');
const dataset = require('./data/fbref-dataset');

// Lista de scripts para executar
const scripts = ["scraper.js"];

// Função para executar um comando e retornar uma Promise
function runScript(scriptName, args) {
    return new Promise((resolve, reject) => {
        console.log(`\n🚀 Executando: ${scriptName} ${args.join(' ')}`);
        
        const child = spawn('node', [scriptName, ...args], {
            stdio: 'inherit', // Mostra a saída do processo filho no console principal
            cwd: __dirname
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${scriptName} concluído com sucesso para ${args[0]} - ${args[1]}`);
                resolve();
            } else {
                console.error(`❌ ${scriptName} falhou para ${args[0]} - ${args[1]} (código: ${code})`);
                reject(new Error(`Processo falhou com código ${code}`));
            }
        });

        child.on('error', (error) => {
            console.error(`❌ Erro ao executar ${scriptName}:`, error);
            reject(error);
        });
    });
}

// Função para processar sequencialmente (um por vez)
async function processSequentially() {
    console.log('='.repeat(60));
    console.log('🏆 INICIANDO COLETA DE DADOS DE FUTEBOL');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    let totalProcessed = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const script of scripts) {
        console.log(`\n📋 Processando com script: ${script}`);
        
        for (const [pais, ligas] of Object.entries(dataset)) {
            for (const [liga, link] of Object.entries(ligas)) {
                totalProcessed++;
                
                try {
                    console.log(`\n⚽ Processando: ${pais.toUpperCase()} - ${liga}`);
                    console.log(`🔗 URL: ${link}`);
                    
                    await runScript(script, [pais, liga, link]);
                    successCount++;
                    
                } catch (error) {
                    console.error(`\n❌ Erro ao processar ${pais} - ${liga}:`, error.message);
                    errorCount++;
                }
                
                // Pequena pausa entre execuções para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO FINAL');
    console.log('='.repeat(60));
    console.log(`⏱️  Tempo total: ${duration} segundos`);
    console.log(`📈 Total processado: ${totalProcessed}`);
    console.log(`✅ Sucessos: ${successCount}`);
    console.log(`❌ Erros: ${errorCount}`);
    console.log(`📁 Arquivos salvos no diretório: ./data/`);
    
    if (errorCount === 0) {
        console.log('\n🎉 Todos os dados foram coletados com sucesso!');
    } else {
        console.log(`\n⚠️  ${errorCount} erro(s) encontrado(s). Verifique os logs acima.`);
    }
}

// Função para processar em paralelo (mais rápido, mas pode sobrecarregar o servidor)
async function processInParallel() {
    console.log('='.repeat(60));
    console.log('🏆 INICIANDO COLETA DE DADOS DE FUTEBOL (PARALELO)');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    const promises = [];

    for (const script of scripts) {
        for (const [pais, ligas] of Object.entries(dataset)) {
            for (const [liga, link] of Object.entries(ligas)) {
                console.log(`📋 Adicionando à fila: ${pais} - ${liga}`);
                promises.push(
                    runScript(script, [pais, liga, link])
                        .catch(error => ({
                            error: true,
                            pais,
                            liga,
                            message: error.message
                        }))
                );
            }
        }
    }

    console.log(`\n🚀 Executando ${promises.length} processos em paralelo...`);
    const results = await Promise.all(promises);
    
    const errors = results.filter(result => result && result.error);
    const successCount = results.length - errors.length;

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO FINAL (PARALELO)');
    console.log('='.repeat(60));
    console.log(`⏱️  Tempo total: ${duration} segundos`);
    console.log(`📈 Total processado: ${results.length}`);
    console.log(`✅ Sucessos: ${successCount}`);
    console.log(`❌ Erros: ${errors.length}`);
    
    if (errors.length > 0) {
        console.log('\n❌ Erros encontrados:');
        errors.forEach(error => {
            console.log(`   • ${error.pais} - ${error.liga}: ${error.message}`);
        });
    }
}

// Função principal
async function main() {
    try {
        // Verificar se o script scraper existe
        const scraperPath = path.join(__dirname, 'scraper.js');
        const fs = require('fs');
        
        if (!fs.existsSync(scraperPath)) {
            console.error('❌ Arquivo scraper.js não encontrado!');
            console.log('📝 Certifique-se de que o arquivo scraper.js está no mesmo diretório.');
            process.exit(1);
        }

        // Verificar argumentos da linha de comando para modo de execução
        const args = process.argv.slice(2);
        const mode = args[0] || 'sequential';

        if (mode === 'parallel') {
            await processInParallel();
        } else {
            await processSequentially();
        }

    } catch (error) {
        console.error('❌ Erro na execução principal:', error);
        process.exit(1);
    }
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { dataset, runScript };