# Soccer Analytics - Aplicação Web Completa

Sistema completo de análise de futebol com interface web moderna, incluindo coleta de dados, análise estatística e previsão de resultados das principais ligas mundiais.

## 🏆 Funcionalidades Principais

### 📊 **Sistema de Análise**
- ⚽ Coleta automática de dados de jogos realizados e futuros
- 🧮 Cálculo de força relativa dos times usando álgebra linear
- 🔮 Previsão de resultados para próximos jogos
- 📈 Ranking de times por força calculada
- ⭐ Identificação de jogos com alta previsibilidade

### 🌐 **Interface Web**
- 🎨 Design moderno e responsivo
- 📱 Compatível com dispositivos móveis
- 🏟️ Tema visual relacionado ao futebol
- 🔄 Atualização em tempo real
- 📋 Sistema de seleção intuitivo de ligas

### 🌍 **Cobertura Global**
Suporte para mais de 80 ligas mundiais, incluindo:
- 🇧🇷 Brasil (Série A, Série B)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra (Premier League, Championship, etc.)
- 🇪🇸 Espanha (La Liga, Segunda División)
- 🇮🇹 Itália (Serie A, Serie B)
- 🇩🇪 Alemanha (Bundesliga, 2. Bundesliga)
- 🇫🇷 França (Ligue 1, Ligue 2)
- E muitas outras...

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js (≥14.0.0)
- Python (≥3.6)
- npm ou yarn

### **Instalação das Dependências**

```bash
# Instalar dependências Node.js
npm install

# Verificar se Python está disponível
python --version

# Instalar dependências Python (se necessário)
pip install numpy pandas
```

### **Estrutura do Projeto**
```
/
├── app.js                 # Servidor Express
├── main.js               # Orquestrador do scraper
├── scraper.js            # Web scraper principal
├── chance.py             # Análise estatística
├── fbref-dataset.js      # Dataset das ligas
├── package.json          # Dependências Node.js
├── README.md             # Documentação
├── public/               # Interface web
│   ├── index.html        # Página principal
│   ├── style.css         # Estilos CSS
│   ├── script.js         # Lógica JavaScript
│   └── assets/           # Recursos (ícones, imagens)
└── data/                 # Dados coletados (CSV)
    ├── BRA-Campeonato_Brasileiro_Série_A.csv
    ├── BRA-Campeonato_Brasileiro_Série_A_next.csv
    ├── ENG-Premier_League.csv
    ├── ENG-Premier_League_next.csv
    └── ...
```

## 💻 Como Usar

### **1. Coleta de Dados (Primeira Execução)**

```bash
# Coletar dados de todas as ligas (modo sequencial - recomendado)
npm run scrape-all

# Coletar dados em paralelo (mais rápido, mas pode ser bloqueado)
npm run scrape-parallel

# Coletar dados de uma liga específica
node scraper.js BRA "Campeonato Brasileiro Série A" "https://fbref.com/..."
```

### **2. Iniciar Aplicação Web**

```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

### **3. Análise Manual via Terminal**

```bash
# Listar todas as ligas disponíveis
python chance.py --list

# Analisar liga específica
python chance.py BRA "Campeonato Brasileiro Série A"
python chance.py ENG "Premier League"
```

## 🎯 Funcionalidades da Interface Web

### **📱 User Flow 1: Análise por Liga**
1. **Página Inicial**: Selecionar país e liga
2. **Processamento**: Sistema executa análise automaticamente
3. **Resultados**: Visualizar ranking, próximos jogos e previsões
4. **Filtros**: Ajustar limiar de diferença significativa
5. **Navegação**: Voltar e analisar outras ligas

### **🗓️ User Flow 2: Jogos da Semana**
1. **Jogos Destacados**: Ver todos os jogos com alta previsibilidade
2. **Filtro Global**: Ajustar limiar para todas as ligas
3. **Estatísticas**: Visualizar resumo consolidado
4. **Detalhamento**: Análise por liga individual

### **📊 Recursos Visuais**
- **Tabelas Interativas**: Ranking de times, próximos jogos, jogos destacados
- **Filtros Dinâmicos**: Ajuste de limiar de diferença em tempo real
- **Indicadores Visuais**: Cores para diferenças positivas/negativas
- **Loading States**: Feedback visual durante processamento
- **Responsive Design**: Funciona em desktop, tablet e mobile

## 🛠️ API Endpoints

### **Frontend Consumption**
- `GET /` - Página principal da aplicação
- `GET /api/leagues` - Lista todas as ligas disponíveis
- `POST /api/analyze` - Executa análise para liga específica
- `GET /api/highlighted-games` - Jogos destacados de todas as ligas
- `POST /api/filter-highlighted` - Filtrar jogos por limiar

### **Exemplo de Requisição**
```javascript
// Analisar uma liga
fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leagueId: 'BRA-Campeonato_Brasileiro_Série_A' })
})
```

## 📈 Algoritmo de Análise

### **Metodologia**
O sistema utiliza **álgebra linear** para calcular a força relativa dos times:

1. **Coleta de Dados**: Resultados de jogos já realizados
2. **Sistema Linear**: Cada jogo gera uma equação: `ForçaCasa - ForçaVisitante = DiferençaGols`
3. **Resolução**: Método dos mínimos quadrados para encontrar forças
4. **Previsão**: Aplicar forças calculadas aos próximos jogos

### **Formato dos Dados**
```csv
WEEK;DATE;TIME;HOME;AWAY;FTHG;FTAG;DIFF
1;15/08/2024;16:00;Flamengo;Vasco;3;1;2
2;22/08/2024;18:00;São Paulo;Palmeiras;1;2;-1
```

### **Saída da Análise**
- **Ranking**: Times ordenados por força calculada
- **Previsões**: Diferença esperada para próximos jogos
- **Destacados**: Jogos com |diferença| ≥ limiar configurável

## ⚙️ Configurações Avançadas

### **Personalizar Ligas**
Edite o arquivo `fbref-dataset.js` para adicionar/remover ligas:

```javascript
const dataset = {
    "SEU_PAIS": {
        "Nome da Liga": "URL_da_Liga_no_FBRef"
    }
};
```

### **Ajustar Puppeteer**
Modifique configurações do navegador em `scraper.js`:

```javascript
const browser = await puppeteer.launch({
    headless: true,          // false para debug visual
    args: ['--no-sandbox'],  // adicionar mais opções
});
```

### **Configurar Servidor**
Ajustar porta e configurações em `app.js`:

```javascript
const PORT = process.env.PORT || 3000;
const CACHE_DURATION = 5 * 60 * 1000; // Cache em ms
```

## 🔧 Troubleshooting

### **Problemas Comuns**

**🚫 "Nenhuma liga disponível"**
- Execute `npm run scrape-all` para coletar dados
- Verifique se a pasta `data/` contém arquivos CSV

**⏱️ "Timeout na análise"**
- Alguns campeonatos podem ter dados inconsistentes
- Tente analisar uma liga menor primeiro

**🐍 "Python script failed"**
- Verifique se Python está instalado: `python --version`
- Instale dependências: `pip install numpy pandas`

**📡 "Erro de conexão"**
- Verifique conexão com internet
- Alguns sites podem ter rate limiting

### **Debug e Logs**
- Logs do servidor aparecem no terminal
- Erros do Python são capturados e exibidos
- Use DevTools do navegador para debug frontend
- Screenshots são salvos automaticamente em caso de erro

## 🚀 Performance e Otimização

### **Cache Inteligente**
- Resultados de análise são cached por 5 minutos
- Evita re-execução desnecessária do Python
- Cache limpo automaticamente

### **Modos de Execução**
- **Sequencial**: Mais seguro, menos chance de bloqueio
- **Paralelo**: Mais rápido, mas pode sobrecarregar servidor

### **Otimizações**
- Compression automática de respostas
- Lazy loading de dados grandes
- Responsive design otimizado

## 📊 Exemplos de Uso

### **Análise do Brasileirão**
```bash
# Terminal
python chance.py BRA "Campeonato Brasileiro Série A"

# Web Interface
1. Selecionar "BRA - Campeonato Brasileiro Série A"
2. Clicar em "Analisar Liga"
3. Ver ranking: Palmeiras, Flamengo, São Paulo...
4. Próximos jogos com previsões
```

### **Jogos Destacados da Semana**
```bash
# Web Interface
1. Clicar em "Jogos da Semana"
2. Ajustar limiar para 1.8
3. Ver todos os jogos previsíveis de todas as ligas
4. Estatísticas: 15 jogos, 8 ligas, diff média 2.1
```

## 🤝 Contribuição

### **Adicionar Nova Liga**
1. Encontrar URL no FBRef
2. Adicionar ao `fbref-dataset.js`
3. Testar coleta: `node scraper.js PAIS "Liga" "URL"`
4. Verificar análise: `python chance.py PAIS-Liga`

### **Melhorias na Interface**
1. Editar arquivos em `public/`
2. Testar com `npm run dev`
3. Seguir padrões de design existentes

## 📄 Licença

MIT License - uso livre para fins educacionais e pessoais.

## ⚠️ Aviso Legal

Este sistema é para fins educacionais e de pesquisa. Respeite os termos de uso dos sites de origem e implemente delays apropriados entre requisições.

---

## 🎯 Roadmap Futuro

- [ ] Sistema de alertas automáticos
- [ ] Integração com APIs de apostas
- [ ] Machine Learning para melhorar previsões
- [ ] Dashboard administrativo
- [ ] API pública para terceiros
- [ ] Histórico de acertos das previsões

**Desenvolvido com ⚽ para entusiastas do futebol e análise de dados.**