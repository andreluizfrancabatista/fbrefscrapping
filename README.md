# Soccer Data Scraper - Node.js

Web scraper para coleta de dados de jogos de futebol das principais ligas europeias usando Node.js e Puppeteer.

## 📋 Funcionalidades

- ⚽ Coleta dados de jogos realizados (resultados, placares, diferença de gols)
- 📅 Coleta próximos jogos agendados
- 🌍 Suporte para múltiplas ligas europeias
- 📊 Exportação para arquivos CSV
- 🚀 Execução sequencial ou paralela
- 📁 Organização automática de arquivos

## 🏆 Ligas Suportadas

### Inglaterra
- Premier League
- EFL Championship

### Espanha
- La Liga
- La Liga 2

### Itália
- Serie A
- Serie B

### Alemanha
- Bundesliga
- 2. Bundesliga

### França
- Ligue 1
- Ligue 2

## 🚀 Instalação

1. **Clone o repositório ou baixe os arquivos**

2. **Instale as dependências:**
```bash
npm install
```

ou

```bash
npm run install-deps
```

## 💻 Como Usar

### Opção 1: Executar todas as ligas (Recomendado)

**Modo Sequencial (mais seguro):**
```bash
npm start
# ou
npm run scrape-all
# ou
node main.js
```

**Modo Paralelo (mais rápido):**
```bash
npm run scrape-parallel
# ou
node main.js parallel
```

### Opção 2: Executar liga específica

```bash
npm run scrape <pais> <liga> <url>
# ou
node scraper.js <pais> <liga> <url>
```

**Exemplo:**
```bash
node scraper.js inglaterra "Premier League" "https://fbref.com/en/comps/9/schedule/Premier-League-Scores-and-Fixtures"
```

## 📁 Estrutura de Arquivos Gerados

Após a execução, os arquivos CSV serão salvos na pasta `data/`:

```
data/
├── inglaterra-Premier League.csv
├── inglaterra-Premier League_next.csv
├── espanha-La Liga.csv
├── espanha-La Liga_next.csv
├── italia-Serie A.csv
├── italia-Serie A_next.csv
└── ...
```

### Tipos de Arquivo

- **`{pais}-{liga}.csv`**: Jogos já realizados com resultados
- **`{pais}-{liga}_next.csv`**: Próximos 10 jogos agendados

### Estrutura dos Dados

**Jogos Realizados:**
| WEEK | DATE | HOME | AWAY | FTHG | FTAG | DIFF |
|------|------|------|------|------|------|------|
| 1 | 15/08/2024 | Arsenal | Chelsea | 2 | 1 | 1 |

**Próximos Jogos:**
| WEEK | DATE | HOME | AWAY |
|------|------|------|------|
| 15 | 25/05/2024 | Liverpool | Manchester City |

## ⚙️ Configuração

### Modificar Ligas

Para adicionar/remover ligas, edite o objeto `dataset` no arquivo `main.js`:

```javascript
const dataset = {
    "seu_pais": {
        "Nome da Liga": "URL_da_Liga"
    }
};
```

### Opções do Puppeteer

As configurações do navegador podem ser ajustadas no arquivo `scraper.js`:

```javascript
const browser = await puppeteer.launch({
    headless: true,  // false para ver o navegador
    args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        // adicione mais opções conforme necessário
    ]
});
```

## 🔧 Troubleshooting

### Erro: "Tabela não encontrada"
- Verifique se a URL está correta
- O site pode ter mudado a estrutura HTML
- Tente executar com `headless: false` para debugar

### Erro de Timeout
- Aumente o tempo de espera no código
- Verifique sua conexão com a internet
- O site pode estar temporariamente indisponível

### Erro de Permissão
- Certifique-se de ter permissões de escrita na pasta
- Execute como administrador se necessário

## 📊 Diferenças entre Modos de Execução

### Modo Sequencial
- ✅ Mais seguro para o servidor
- ✅ Menos chances de bloqueio
- ❌ Mais lento (um por vez)

### Modo Paralelo
- ✅ Muito mais rápido
- ❌ Pode sobrecarregar o servidor
- ❌ Maior chance de bloqueio por rate limiting

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Puppeteer**: Automação do navegador Chrome
- **fs**: Sistema de arquivos nativo
- **child_process**: Execução de processos filhos

## 📝 Logs e Monitoramento

O sistema fornece logs detalhados durante a execução:

```
🚀 Executando: scraper.js inglaterra Premier League https://...
✅ scraper.js concluído com sucesso para inglaterra - Premier League
📊 RESUMO FINAL
⏱️  Tempo total: 45 segundos
📈 Total processado: 10
✅ Sucessos: 10
❌ Erros: 0
```

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## ⚠️ Aviso Legal

Este scraper é para fins educacionais e de pesquisa. Respeite os termos de uso dos sites e implemente delays apropriados entre as requisições para não sobrecarregar os servidores.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.