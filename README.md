# ⚽ Soccer Analytics - Aplicação Web Completa

Sistema completo de análise de futebol com interface web moderna, incluindo coleta de dados, análise estatística avançada e previsão de resultados das principais ligas mundiais.

![GitHub release (latest by date)](https://img.shields.io/github/v/release/andreluizfrancabatista/fbrefscrapping)
![License](https://img.shields.io/github/license/andreluizfrancabatista/fbrefscrapping)
![Top Language](https://img.shields.io/github/languages/top/andreluizfrancabatista/fbrefscrapping)
![Last Commit](https://img.shields.io/github/last-commit/andreluizfrancabatista/fbrefscrapping)
![Web Scraping](https://img.shields.io/badge/web_scraping-automated-orange?style=flat-square)
![Soccer Analytics](https://img.shields.io/badge/soccer-analytics-4CAF50?style=flat-square)
![80+ Leagues](https://img.shields.io/badge/leagues-80+-blue?style=flat-square)
![Real Time Data](https://img.shields.io/badge/data-real_time-red?style=flat-square)
![Predictions](https://img.shields.io/badge/predictions-ML_powered-purple?style=flat-square)
![Responsive Web](https://img.shields.io/badge/web_app-responsive-success?style=flat-square)

![GitHub issues](https://img.shields.io/github/issues/andreluizfrancabatista/fbrefscrapping?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/andreluizfrancabatista/fbrefscrapping?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/andreluizfrancabatista/fbrefscrapping?style=flat-square)
![Maintenance](https://img.shields.io/badge/maintained-yes-green?style=flat-square)

## 🏆 Visão Geral

O **Soccer Analytics** é uma aplicação web completa que oferece análise inteligente de dados de futebol com interface moderna e intuitiva. O sistema coleta dados automaticamente das principais ligas mundiais, calcula a força relativa dos times usando algoritmos matemáticos avançados e gera previsões precisas para próximos jogos.

### ✨ Principais Funcionalidades

- 🌐 **Interface Web Moderna**: Design responsivo com tema futebol
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **80+ Ligas Mundiais**: Cobertura global das principais competições
- 🧮 **Análise Matemática**: Algoritmo de álgebra linear para cálculo de força dos times
- 🔮 **Previsões Inteligentes**: Resultados esperados para próximos jogos
- 📊 **Rankings Dinâmicos**: Classificação de times por força calculada
- ⭐ **Jogos Destacados**: Identificação de partidas com alta previsibilidade
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js (≥14.0.0)
- Python (≥3.6) com numpy e pandas
- npm ou yarn

### 1. Configuração Inicial
```bash
# Clone o repositório
git clone <seu-repositorio>
cd soccer-analytics

# Instale as dependências Node.js
npm install

# Instale as dependências Python
pip install numpy pandas
```

### 2. Primeira Execução
```bash
# Colete dados das ligas (primeira vez)
npm run scrape-all

# Gere os jogos da semana
npm run generate-weekly

# Inicie a aplicação
npm start
```

### 3. Acesse a Aplicação
Abra seu navegador em: **http://localhost:3000**

## 📋 Comandos Disponíveis

```bash
# 🌐 Aplicação Web
npm start                    # Iniciar servidor (produção)
npm run dev                  # Modo desenvolvimento (auto-reload)

# 📊 Coleta de Dados
npm run scrape-all          # Coletar todas as ligas (sequencial)
npm run scrape-parallel     # Coletar em paralelo (mais rápido)

# ⚡ Jogos da Semana
npm run generate-weekly     # Gerar jogos destacados
npm run update-weekly       # Atualizar dados semanais

# 🔧 Análise Individual
python chance.py --list     # Listar ligas disponíveis
python chance.py BRA "Campeonato Brasileiro Série A"  # Analisar liga específica
```

## 🎯 Como Usar a Interface Web

### 🏠 **User Flow 1: Análise por Liga**
1. **Acesse a página inicial**
2. **Navegue pelo grid de países** organizados por bandeiras
3. **Clique diretamente na liga** desejada
4. **Visualize instantaneamente**:
   - 🏆 Ranking de força dos times
   - 📅 Próximos jogos com previsões
   - ⭐ Jogos destacados (diferença ≥ 1.5)

### 📊 **User Flow 2: Jogos da Semana**
1. **Clique em "Jogos da Semana"**
2. **Jogos carregam automaticamente** ordenados por data/hora
3. **Ajuste o limiar** de diferença conforme necessário
4. **Clique na liga** para análise detalhada
5. **Use "Atualizar Jogos"** para dados mais recentes

## 🏟️ Ligas Suportadas

### 🌎 **Europa (Principais)**
- ![flag](https://flagcdn.com/w20/gb-eng.png) **Inglaterra**: Premier League, Championship, League One, League Two
- ![flag](https://flagcdn.com/w20/es.png) **Espanha**: La Liga, Segunda División, Liga F
- ![flag](https://flagcdn.com/w20/de.png) **Alemanha**: Bundesliga, 2. Bundesliga, Frauen-Bundesliga
- ![flag](https://flagcdn.com/w20/fr.png) **França**: Ligue 1, Ligue 2, Première Ligue
- ![flag](https://flagcdn.com/w20/it.png) **Itália**: Serie A, Serie B

### 🌎 **Américas**
- ![flag](https://flagcdn.com/w20/br.png) **Brasil**: Série A, Série B, Brasileirão Feminino
- ![flag](https://flagcdn.com/w20/ar.png) **Argentina**: Liga Profesional
- ![flag](https://flagcdn.com/w20/us.png) **Estados Unidos**: MLS, NWSL, USL Championship
- ![flag](https://flagcdn.com/w20/mx.png) **México**: Liga MX

### 🌏 **Ásia & Oceania**
- ![flag](https://flagcdn.com/w20/jp.png) **Japão**: J1 League, J2 League, WE League
- ![flag](https://flagcdn.com/w20/kr.png) **Coreia do Sul**: K League 1
- ![flag](https://flagcdn.com/w20/au.png) **Austrália**: A-League Men, A-League Women

**E muitas outras...** (80+ ligas no total)

## 🧮 Metodologia de Análise

### **Algoritmo Matemático**
O sistema utiliza **álgebra linear** para calcular a força relativa dos times:

1. **📊 Coleta de Dados**: Resultados de jogos já realizados
2. **🔢 Sistema Linear**: Cada jogo gera equação: `ForçaCasa - ForçaVisitante = DiferençaGols`
3. **⚡ Resolução**: Método dos mínimos quadrados (numpy.linalg.lstsq)
4. **🔮 Previsão**: Aplicação das forças calculadas aos próximos jogos

### **Exemplo Prático**
```
Flamengo 3 x 1 Vasco  →  ForçaFlamengo - ForçaVasco = +2
São Paulo 1 x 2 Palmeiras  →  ForçaSP - ForçaPalmeiras = -1
...
Sistema resolve automaticamente as forças de todos os times
```

## 📁 Estrutura do Projeto

```
soccer-analytics/
├── 🌐 Frontend
│   ├── public/
│   │   ├── index.html              # Interface principal
│   │   ├── style.css               # Estilos modernos
│   │   ├── script.js               # Lógica JavaScript
│   │   └── assets/
│   │       └── favicon.ico         # Ícone da aplicação
│
├── 🖥️ Backend
│   ├── app.js                      # Servidor Express
│   ├── scraper.js                  # Web scraper (Puppeteer)
│   ├── main.js                     # Orquestrador do scraping
│   ├── generate-weekly.js          # Gerador jogos da semana
│   ├── chance.py                   # Análise estatística (Python)
│   └── fbref-dataset.js            # Dataset das ligas
│
├── 📊 Dados
│   └── data/                       # Arquivos CSV gerados
│       ├── 009-ENG-Premier_League.csv
│       ├── 009-ENG-Premier_League_next.csv
│       └── ...
│
└── 📋 Configuração
    ├── package.json                # Dependências Node.js
    └── README.md                   # Esta documentação
```

## 🔧 Configuração Avançada

### **Adicionar Nova Liga**
1. Edite `fbref-dataset.js`:
```javascript
"PAIS": {
    "Nome da Liga": "https://fbref.com/en/comps/XXX/schedule/..."
}
```
2. Execute: `npm run scrape-all`

### **Personalizar Interface**
- **Cores**: Modifique variáveis CSS em `style.css`
- **Layout**: Ajuste grid em `.countries-grid`
- **Funcionalidades**: Adicione em `script.js`

### **Configurar para Produção**
```bash
# Configurar variáveis de ambiente
export NODE_ENV=production
export PORT=80

# Usar processo manager
npm install pm2 -g
pm2 start app.js --name "soccer-analytics"
pm2 startup
pm2 save
```

## 🐛 Solução de Problemas

### **Problema: "Nenhuma liga disponível"**
```bash
# Verifique se há dados coletados
ls data/
# Se vazio, execute:
npm run scrape-all
```

### **Problema: Erro no Python**
```bash
# Instale dependências Python
pip install numpy pandas

# Teste manual
python chance.py --list
```

### **Problema: Erro de porta**
```bash
# Altere a porta em app.js ou use variável de ambiente
export PORT=8080
npm start
```

### **Problema: Browser não abre Puppeteer**
```bash
# No Ubuntu/Debian
sudo apt-get install chromium-browser

# Ou instale dependências do Chrome
sudo apt-get install -y gconf-service libasound2 libatk1.0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

## 📊 Exemplo de Saída

### **Ranking de Times (Brasileirão)**
```
1. Palmeiras      = +1.85
2. Flamengo       = +1.23
3. São Paulo      = +0.67
4. Internacional  = +0.45
...
```

### **Próximos Jogos**
```
WEEK | DATA     | HORA  | CASA      | VISITANTE | DIFF PREVISTA
15   | 07/06/25 | 16:00 | Palmeiras | Flamengo  | +0.62
16   | 08/06/25 | 18:30 | São Paulo | Santos    | +1.23
```

## 🚀 Deploy em VPS

### **Opção 1: Deploy Tradicional**
```bash
# Na VPS
git clone <seu-repo>
cd soccer-analytics
npm install
pip install numpy pandas

# Configurar
npm run scrape-all
npm run generate-weekly

# Produção
pm2 start app.js
```

### **Opção 2: Docker**
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache chromium python3 py3-pip
RUN pip install numpy pandas
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuição

### **Como Contribuir**
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m "Adiciona nova funcionalidade"`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### **Roadmap Futuro**
- [ ] 🔔 Sistema de alertas automáticos
- [ ] 📈 Histórico de acertos das previsões
- [ ] 🤖 Machine Learning para melhorar previsões
- [ ] 📱 App mobile (React Native)
- [ ] 🔗 API pública para terceiros
- [ ] 📊 Dashboard administrativo
- [ ] 🎯 Integração com APIs de odds

## 📄 Licença

MIT License - Uso livre para fins educacionais e comerciais.

## ⚠️ Aviso Legal

Esta aplicação é destinada para fins educacionais, de pesquisa e entretenimento. Respeite os termos de uso dos sites de origem dos dados e utilize com responsabilidade.

## 📞 Suporte

- 🐛 **Issues**: Reporte bugs via GitHub Issues
- 💡 **Sugestões**: Use GitHub Discussions
- 📧 **Contato**: Abra uma issue para contato direto

---

## 🎯 Conclusão

O **Soccer Analytics** representa uma solução completa e moderna para análise de dados de futebol, combinando:

- ✅ **Tecnologia atual** (Node.js, Python, HTML5)
- ✅ **Interface intuitiva** e responsiva
- ✅ **Algoritmos matemáticos** comprovados
- ✅ **Dados em tempo real** de 80+ ligas
- ✅ **Fácil instalação** e configuração
- ✅ **Código aberto** e extensível

**Transforme dados em insights. Transforme insights em vantagem.** ⚽📊

---

*Desenvolvido com ⚽ para entusiastas do futebol e análise de dados.*

![Footer](https://img.shields.io/badge/Made%20with-⚽%20and%20💚-4CAF50?style=for-the-badge)