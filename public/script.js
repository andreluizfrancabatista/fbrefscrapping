// Estado da aplicação
const App = {
    currentSection: 'home',
    leagues: [],
    currentAnalysis: null,
    weeklyGames: [],
    isLoading: false
};

// Elementos DOM
const elements = {
    // Navigation
    navButtons: document.querySelectorAll('.nav-btn'),
    sections: document.querySelectorAll('.section'),
    
    // Home section
    countriesGrid: document.getElementById('countriesGrid'),
    
    // Weekly section
    thresholdSlider: document.getElementById('thresholdSlider'),
    thresholdValue: document.getElementById('thresholdValue'),
    loadWeeklyBtn: document.getElementById('loadWeeklyBtn'),
    weeklyResults: document.getElementById('weeklyResults'),
    
    // Results section
    backBtn: document.getElementById('backBtn'),
    resultsTitle: document.getElementById('resultsTitle'),
    rankingsTable: document.getElementById('rankingsTable'),
    nextGamesTable: document.getElementById('nextGamesTable'),
    highlightedGamesTable: document.getElementById('highlightedGamesTable'),
    campaignEndedWarning: document.getElementById('campaignEndedWarning'),
    resultsThresholdSlider: document.getElementById('resultsThresholdSlider'),
    resultsThresholdValue: document.getElementById('resultsThresholdValue'),
    
    // Global
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    errorModal: document.getElementById('errorModal'),
    errorMessage: document.getElementById('errorMessage'),
    errorOkBtn: document.getElementById('errorOkBtn'),
    modalClose: document.querySelector('.modal-close')
};

// URLs das bandeiras dos países
const countryFlags = {
    "ARG": "https://flagcdn.com/w20/ar.png",
    "AUS": "https://flagcdn.com/w20/au.png", 
    "AUT": "https://flagcdn.com/w20/at.png",
    "BEL": "https://flagcdn.com/w20/be.png",
    "BOL": "https://flagcdn.com/w20/bo.png",
    "BRA": "https://flagcdn.com/w20/br.png",
    "BUL": "https://flagcdn.com/w20/bg.png",
    "CAN": "https://flagcdn.com/w20/ca.png",
    "CHI": "https://flagcdn.com/w20/cl.png",
    "CHN": "https://flagcdn.com/w20/cn.png",
    "COL": "https://flagcdn.com/w20/co.png",
    "CRO": "https://flagcdn.com/w20/hr.png",
    "CZE": "https://flagcdn.com/w20/cz.png",
    "DEN": "https://flagcdn.com/w20/dk.png",
    "ECU": "https://flagcdn.com/w20/ec.png",
    "ENG": "https://flagcdn.com/w20/gb-eng.png",
    "ESP": "https://flagcdn.com/w20/es.png",
    "FIN": "https://flagcdn.com/w20/fi.png",
    "FRA": "https://flagcdn.com/w20/fr.png",
    "GER": "https://flagcdn.com/w20/de.png",
    "GRE": "https://flagcdn.com/w20/gr.png",
    "HUN": "https://flagcdn.com/w20/hu.png",
    "IND": "https://flagcdn.com/w20/in.png",
    "IRN": "https://flagcdn.com/w20/ir.png",
    "ITA": "https://flagcdn.com/w20/it.png",
    "JPN": "https://flagcdn.com/w20/jp.png",
    "KOR": "https://flagcdn.com/w20/kr.png",
    "KSA": "https://flagcdn.com/w20/sa.png",
    "MEX": "https://flagcdn.com/w20/mx.png",
    "NED": "https://flagcdn.com/w20/nl.png",
    "NOR": "https://flagcdn.com/w20/no.png",
    "PAR": "https://flagcdn.com/w20/py.png",
    "PER": "https://flagcdn.com/w20/pe.png",
    "POL": "https://flagcdn.com/w20/pl.png",
    "POR": "https://flagcdn.com/w20/pt.png",
    "ROU": "https://flagcdn.com/w20/ro.png",
    "RSA": "https://flagcdn.com/w20/za.png",
    "RUS": "https://flagcdn.com/w20/ru.png",
    "SCO": "https://flagcdn.com/w20/gb-sct.png",
    "SRB": "https://flagcdn.com/w20/rs.png",
    "SUI": "https://flagcdn.com/w20/ch.png",
    "SWE": "https://flagcdn.com/w20/se.png",
    "TUR": "https://flagcdn.com/w20/tr.png",
    "UKR": "https://flagcdn.com/w20/ua.png",
    "URU": "https://flagcdn.com/w20/uy.png",
    "USA": "https://flagcdn.com/w20/us.png",
    "VEN": "https://flagcdn.com/w20/ve.png"
};

// Nomes completos dos países
const countryNames = {
    'ARG': 'Argentina', 'AUS': 'Austrália', 'AUT': 'Áustria', 'BEL': 'Bélgica', 'BOL': 'Bolívia',
    'BRA': 'Brasil', 'BUL': 'Bulgária', 'CAN': 'Canadá', 'CHI': 'Chile', 'CHN': 'China',
    'COL': 'Colômbia', 'CRO': 'Croácia', 'CZE': 'República Tcheca', 'DEN': 'Dinamarca', 'ECU': 'Equador',
    'ENG': 'Inglaterra', 'ESP': 'Espanha', 'FIN': 'Finlândia', 'FRA': 'França', 'GER': 'Alemanha',
    'GRE': 'Grécia', 'HUN': 'Hungria', 'IND': 'Índia', 'IRN': 'Irã', 'ITA': 'Itália',
    'JPN': 'Japão', 'KOR': 'Coreia do Sul', 'KSA': 'Arábia Saudita', 'MEX': 'México', 'NED': 'Holanda',
    'NOR': 'Noruega', 'PAR': 'Paraguai', 'PER': 'Peru', 'POL': 'Polônia', 'POR': 'Portugal',
    'ROU': 'Romênia', 'RSA': 'África do Sul', 'RUS': 'Rússia', 'SCO': 'Escócia', 'SRB': 'Sérvia',
    'SUI': 'Suíça', 'SWE': 'Suécia', 'TUR': 'Turquia', 'UKR': 'Ucrânia', 'URU': 'Uruguai',
    'USA': 'Estados Unidos', 'VEN': 'Venezuela'
};
const Utils = {
    showLoading(text = 'Carregando...') {
        elements.loadingText.textContent = text;
        elements.loadingOverlay.classList.add('active');
        App.isLoading = true;
    },

    hideLoading() {
        elements.loadingOverlay.classList.remove('active');
        App.isLoading = false;
    },

    showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorModal.classList.add('active');
    },

    hideError() {
        elements.errorModal.classList.remove('active');
    },

    formatDiff(diff) {
        const value = Math.abs(diff).toFixed(2);
        const sign = diff >= 0 ? '+' : '-';
        const className = diff >= 0 ? 'diff-positive' : 'diff-negative';
        return `<span class="${className}">${sign}${value}</span>`;
    },

    formatStrength(strength) {
        const value = strength.toFixed(2);
        const className = strength >= 0 ? 'diff-positive' : 'diff-negative';
        return `<span class="${className}">${value}</span>`;
    },

    createTable(headers, rows, options = {}) {
        const table = document.createElement('table');
        
        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body
        const tbody = document.createElement('tbody');
        if (rows.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = headers.length;
            td.textContent = options.emptyMessage || 'Nenhum dado disponível';
            td.style.textAlign = 'center';
            td.style.padding = '2rem';
            td.style.color = '#666';
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            rows.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.innerHTML = cell;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        }
        table.appendChild(tbody);
        
        return table;
    }
};

// API calls
const API = {
    async getLeagues() {
        try {
            const response = await fetch('/api/leagues');
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }
            
            return data.leagues;
        } catch (error) {
            console.error('Erro ao carregar ligas:', error);
            throw error;
        }
    },

    async analyzeLeague(leagueId) {
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ leagueId })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }
            
            return data.data;
        } catch (error) {
            console.error('Erro na análise:', error);
            throw error;
        }
    },

    async getHighlightedGames(threshold = 1.5) {
        try {
            const response = await fetch(`/api/highlighted-games?threshold=${threshold}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }
            
            return data.games;
        } catch (error) {
            console.error('Erro ao carregar jogos destacados:', error);
            throw error;
        }
    }
};

// Navigation
const Navigation = {
    init() {
        elements.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchSection(section);
            });
        });
        
        elements.backBtn.addEventListener('click', () => {
            this.switchSection('home');
        });
    },

    switchSection(sectionName) {
        // Update nav buttons
        elements.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === sectionName);
        });
        
        // Update sections
        elements.sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionName);
        });
        
        App.currentSection = sectionName;
    }
};

// Home section functionality
const Home = {
    init() {
        this.loadLeagues();
    },

    async loadLeagues() {
        try {
            Utils.showLoading('Carregando ligas disponíveis...');
            
            App.leagues = await API.getLeagues();
            
            if (App.leagues.length === 0) {
                elements.countriesGrid.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #666; grid-column: 1 / -1;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <p>Nenhuma liga disponível</p>
                        <p><small>Execute o scraping para coletar dados das ligas</small></p>
                    </div>
                `;
            } else {
                this.renderCountriesGrid();
            }
            
        } catch (error) {
            Utils.showError('Erro ao carregar ligas: ' + error.message);
        } finally {
            Utils.hideLoading();
        }
    },

    renderCountriesGrid() {
        // Agrupar ligas por país
        const countriesMap = new Map();
        
        App.leagues.forEach(league => {
            if (!countriesMap.has(league.country)) {
                countriesMap.set(league.country, []);
            }
            countriesMap.get(league.country).push(league);
        });

        // Ordenação personalizada: principais ligas primeiro, depois alfabética
        const priorityOrder = ['ENG', 'ESP', 'GER', 'FRA', 'ITA'];
        
        const sortedCountries = Array.from(countriesMap.entries())
            .sort((a, b) => {
                const [countryCodeA] = a;
                const [countryCodeB] = b;
                
                // Verificar se estão na lista de prioridade
                const priorityA = priorityOrder.indexOf(countryCodeA);
                const priorityB = priorityOrder.indexOf(countryCodeB);
                
                // Se ambos estão na lista de prioridade, ordenar pela posição na lista
                if (priorityA !== -1 && priorityB !== -1) {
                    return priorityA - priorityB;
                }
                
                // Se apenas A está na lista de prioridade, A vem primeiro
                if (priorityA !== -1 && priorityB === -1) {
                    return -1;
                }
                
                // Se apenas B está na lista de prioridade, B vem primeiro
                if (priorityA === -1 && priorityB !== -1) {
                    return 1;
                }
                
                // Se nenhum está na lista de prioridade, ordenar alfabeticamente
                const nameA = countryNames[countryCodeA] || countryCodeA;
                const nameB = countryNames[countryCodeB] || countryCodeB;
                return nameA.localeCompare(nameB);
            });

        elements.countriesGrid.innerHTML = '';

        sortedCountries.forEach(([countryCode, leagues]) => {
            const countryCard = this.createCountryCard(countryCode, leagues);
            elements.countriesGrid.appendChild(countryCard);
        });
    },

    createCountryCard(countryCode, leagues) {
        const card = document.createElement('div');
        card.className = 'country-card';
        
        const flagUrl = countryFlags[countryCode] || 'https://flagcdn.com/w20/un.png';
        const countryName = countryNames[countryCode] || countryCode;
        
        // Ordenar ligas pelo compNumber extraído do ID do arquivo CSV
        const sortedLeagues = leagues.sort((a, b) => {
            // Extrair compNumber do ID (formato: "123-PAIS-Liga" ou "PAIS-Liga")
            const extractCompNumber = (id) => {
                const match = id.match(/^(\d+)-/);
                return match ? parseInt(match[1]) : 999;
            };
            
            // Exceção especial para Itália - ordenação customizada
            if (countryCode === 'ITA') {
                const italyOrder = ['Serie A', 'Serie B'];
                const indexA = italyOrder.findIndex(name => a.league.includes(name));
                const indexB = italyOrder.findIndex(name => b.league.includes(name));
                
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
            }
            
            const compA = extractCompNumber(a.id);
            const compB = extractCompNumber(b.id);
            
            return compA - compB;
        });
        
        card.innerHTML = `
            <div class="country-header">
                <img src="${flagUrl}" alt="${countryName}" class="country-flag" onerror="this.style.display='none'">
                <div class="country-name">${countryName}</div>
            </div>
            <div class="leagues-list">
                ${sortedLeagues.map(league => `
                    <div class="league-item" 
                         data-league-id="${league.id}"
                         data-country-code="${countryCode}"
                         data-flag="${flagUrl}"
                         onclick="Home.selectLeague('${league.id}', '${league.displayName}', '${countryCode}', '${flagUrl}')">
                        ${league.league}
                    </div>
                `).join('')}
            </div>
        `;
        
        return card;
    },

    selectLeague(leagueId, displayName, countryCode, flagUrl) {
        // Remover seleção anterior
        document.querySelectorAll('.league-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Adicionar seleção atual
        const selectedItem = document.querySelector(`[data-league-id="${leagueId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        // Ir diretamente para a análise
        this.analyzeLeague(leagueId, displayName);
    },

    async analyzeLeague(leagueId, displayName) {
        try {
            Utils.showLoading(`Analisando ${displayName}...`);
            
            App.currentAnalysis = await API.analyzeLeague(leagueId);
            App.currentAnalysis.leagueName = displayName;
            
            Results.display();
            Navigation.switchSection('results');
            
        } catch (error) {
            Utils.showError('Erro na análise: ' + error.message);
        } finally {
            Utils.hideLoading();
        }
    },

    clearLeagueSelection() {
        // Remover seleção visual
        document.querySelectorAll('.league-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
    }
};

// Weekly section functionality
const Weekly = {
    currentGames: [],
    sortColumn: 'datetime',
    sortDirection: 'asc',

    init() {
        elements.thresholdSlider.addEventListener('input', (e) => {
            elements.thresholdValue.textContent = e.target.value;
            this.filterCurrentGames();
        });
        
        elements.loadWeeklyBtn.addEventListener('click', () => {
            this.loadWeeklyGames();
        });

        // Carregar jogos automaticamente quando a seção for ativada
        this.setupAutoLoad();
    },

    setupAutoLoad() {
        // Observar quando a seção weekly se torna ativa
        const weeklySection = document.getElementById('weekly');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (weeklySection.classList.contains('active') && this.currentGames.length === 0) {
                        // Carregar jogos automaticamente na primeira vez que a seção for ativada
                        this.loadWeeklyGames();
                    }
                }
            });
        });

        observer.observe(weeklySection, {
            attributes: true,
            attributeFilter: ['class']
        });
    },

    async loadWeeklyGames() {
        const threshold = parseFloat(elements.thresholdSlider.value);
        
        try {
            Utils.showLoading('Carregando jogos destacados...');
            
            const response = await fetch(`/api/highlighted-games?threshold=${threshold}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error);
            }
            
            // Filtrar jogos válidos imediatamente após carregar
            this.currentGames = data.games.filter(game => this.isValidGameData(game));
            
            this.displayWeeklyGames({
                ...data,
                games: this.currentGames
            });
            
        } catch (error) {
            Utils.showError('Erro ao carregar jogos: ' + error.message);
        } finally {
            Utils.hideLoading();
        }
    },

    filterCurrentGames() {
        const threshold = parseFloat(elements.thresholdSlider.value);
        const filteredGames = this.currentGames
            .filter(game => Math.abs(game.predictedDiff) >= threshold)
            .filter(game => this.isValidGameData(game)); // Filtrar jogos com dados inválidos
        
        this.displayWeeklyGames({
            games: filteredGames,
            threshold: threshold,
            count: filteredGames.length
        });
    },

    isValidGameData(game) {
        // Verificar se os dados do jogo são válidos para exibição
        
        // Verificação rigorosa da data
        if (!game.date || 
            game.date === '-' || 
            game.date === 'NaN' ||
            game.date === 'undefined' ||
            game.date === 'null' ||
            game.date.toString().includes('NaN') ||
            game.date.toString().includes('undefined') ||
            game.date.toString().includes('null') ||
            game.date.toString().toLowerCase() === 'nan') {
            console.log('Jogo filtrado por data inválida:', game.home, 'vs', game.away, 'Data:', game.date);
            return false;
        }
        
        // Verificação dos times
        if (!game.home || 
            !game.away || 
            game.home === '' || 
            game.away === '' ||
            game.home.toString().includes('NaN') ||
            game.away.toString().includes('NaN')) {
            console.log('Jogo filtrado por times inválidos:', game.home, 'vs', game.away);
            return false;
        }
        
        // Verificação da diferença prevista
        if (isNaN(game.predictedDiff) || 
            !isFinite(game.predictedDiff) ||
            game.predictedDiff === null ||
            game.predictedDiff === undefined) {
            console.log('Jogo filtrado por diff inválida:', game.home, 'vs', game.away, 'Diff:', game.predictedDiff);
            return false;
        }
        
        return true;
    },

    sortGames(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = column === 'predictedDiff' ? 'desc' : 'asc';
        }

        const threshold = parseFloat(elements.thresholdSlider.value);
        const filteredGames = this.currentGames
            .filter(game => Math.abs(game.predictedDiff) >= threshold)
            .filter(game => this.isValidGameData(game)); // Filtrar jogos com dados inválidos

        filteredGames.sort((a, b) => {
            let valueA, valueB;

            // Tratamento especial para diferentes tipos de dados
            if (column === 'predictedDiff') {
                valueA = Math.abs(a.predictedDiff);
                valueB = Math.abs(b.predictedDiff);
            } else if (column === 'datetime') {
                // Ordenação por data/hora combinada
                valueA = this.parseDateTime(a.date, a.time);
                valueB = this.parseDateTime(b.date, b.time);
            } else if (column === 'date') {
                // Ordenação correta por data
                valueA = this.parseDate(a.date);
                valueB = this.parseDate(b.date);
            } else if (column === 'time') {
                // Ordenação por hora
                valueA = this.parseTime(a.time);
                valueB = this.parseTime(b.time);
            } else if (typeof a[column] === 'string') {
                valueA = a[column].toLowerCase();
                valueB = b[column].toLowerCase();
            } else {
                valueA = a[column];
                valueB = b[column];
            }

            // Comparação
            if (valueA === null || valueA === undefined) return 1;
            if (valueB === null || valueB === undefined) return -1;

            if (this.sortDirection === 'asc') {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });

        this.displayWeeklyGames({
            games: filteredGames,
            threshold: threshold,
            count: filteredGames.length
        });
    },

    parseDate(dateStr) {
        // Converte data no formato DD/MM/YYYY para objeto Date
        if (!dateStr || dateStr === '-' || dateStr.includes('NaN')) {
            return new Date(0);
        }
        
        try {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // JavaScript months são 0-indexed
                const year = parseInt(parts[2]);
                
                // Verificar se os valores são válidos
                if (isNaN(day) || isNaN(month) || isNaN(year) || 
                    day < 1 || day > 31 || month < 0 || month > 11 || year < 2020) {
                    return new Date(0);
                }
                
                return new Date(year, month, day);
            }
        } catch (error) {
            console.warn('Erro ao parsear data:', dateStr);
        }
        
        return new Date(0);
    },

    parseTime(timeStr) {
        // Converte hora no formato HH:MM para minutos desde meia-noite
        if (!timeStr || timeStr === '-' || timeStr.includes('NaN')) {
            return 0;
        }
        
        try {
            const parts = timeStr.split(':');
            if (parts.length >= 2) {
                const hours = parseInt(parts[0]);
                const minutes = parseInt(parts[1]);
                
                // Verificar se os valores são válidos
                if (isNaN(hours) || isNaN(minutes) || 
                    hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                    return 0;
                }
                
                return hours * 60 + minutes;
            }
        } catch (error) {
            console.warn('Erro ao parsear hora:', timeStr);
        }
        
        return 0;
    },

    parseDateTime(dateStr, timeStr) {
        // Combina data e hora para ordenação precisa
        const date = this.parseDate(dateStr);
        const timeMinutes = this.parseTime(timeStr);
        
        // Adiciona os minutos à data
        const dateTime = new Date(date.getTime());
        dateTime.setHours(Math.floor(timeMinutes / 60));
        dateTime.setMinutes(timeMinutes % 60);
        
        return dateTime;
    },

    displayWeeklyGames(data) {
        elements.weeklyResults.innerHTML = '';
        
        // Filtrar jogos com dados inválidos ANTES de exibir
        const validGames = data.games.filter(game => this.isValidGameData(game));
        
        // Ordenar por data/hora por padrão
        const sortedGames = this.sortGamesByDateTime(validGames);
        
        if (sortedGames.length === 0) {
            elements.weeklyResults.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-info-circle"></i> Nenhum jogo encontrado</h3>
                    </div>
                    <div class="table-container">
                        <p style="text-align: center; padding: 2rem; color: #666;">
                            Nenhum jogo com diferença significativa e dados válidos encontrado com o limiar atual.
                        </p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Statistics usando apenas jogos válidos
        const stats = this.calculateStats(sortedGames);
        
        // Update info
        const updateInfo = data.lastUpdate ? 
            `<div class="update-info">Última atualização: ${new Date(data.lastUpdate).toLocaleString()}</div>` : '';
        
        elements.weeklyResults.innerHTML = `
            ${updateInfo}
            <div class="weekly-stats">
                <div class="stat-item">
                    <div class="stat-value">${stats.totalGames}</div>
                    <div class="stat-label">Jogos Destacados</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.leagues}</div>
                    <div class="stat-label">Ligas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.avgDiff}</div>
                    <div class="stat-label">Diff Média</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${data.totalGames || 'N/A'}</div>
                    <div class="stat-label">Total Processado</div>
                </div>
            </div>
        `;
        
        // Sortable table usando jogos ordenados
        const table = this.createSortableTable(sortedGames);
        
        const tableCard = document.createElement('div');
        tableCard.className = 'card';
        tableCard.innerHTML = `
            <div class="card-header">
                <h3><i class="fas fa-star"></i> Jogos Destacados da Semana</h3>
                <button class="regenerate-btn" onclick="Weekly.regenerateData()">
                    <i class="fas fa-sync-alt"></i> Atualizar
                </button>
            </div>
            <div class="table-container"></div>
        `;
        
        tableCard.querySelector('.table-container').appendChild(table);
        elements.weeklyResults.appendChild(tableCard);
    },

    sortGamesByDateTime(games) {
        return games.sort((a, b) => {
            const dateTimeA = this.parseDateTime(a.date, a.time);
            const dateTimeB = this.parseDateTime(b.date, b.time);
            return dateTimeA - dateTimeB; // Ordem crescente (mais próximo primeiro)
        });
    },

    createSortableTable(games) {
        const table = document.createElement('table');
        table.className = 'sortable-table';
        
        // Header with sorting
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const columns = [
            { key: 'league', label: 'Liga', sortable: true },
            { key: 'datetime', label: 'Data/Hora', sortable: true },
            { key: 'home', label: 'Casa', sortable: true },
            { key: 'away', label: 'Visitante', sortable: true },
            { key: 'predictedDiff', label: 'Diff Prevista', sortable: true }
        ];
        
        columns.forEach(col => {
            const th = document.createElement('th');
            th.innerHTML = col.label;
            
            if (col.sortable) {
                th.className = 'sortable';
                th.style.cursor = 'pointer';
                th.onclick = () => this.sortGames(col.key);
                
                // Add sort indicator
                if (this.sortColumn === col.key) {
                    const indicator = this.sortDirection === 'asc' ? ' ↑' : ' ↓';
                    th.innerHTML += ` <span class="sort-indicator">${indicator}</span>`;
                }
            }
            
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body - APLICAR FILTRO AQUI TAMBÉM
        const tbody = document.createElement('tbody');
        const validGames = games.filter(game => this.isValidGameData(game));
        
        console.log('Total games before filter:', games.length);
        console.log('Valid games after filter:', validGames.length);
        
        validGames.forEach(game => {
            const tr = document.createElement('tr');
            
            // Formatar data/hora combinada
            const dateTimeDisplay = this.formatDateTime(game.date, game.time);
            
            tr.innerHTML = `
                <td>
                    <span class="league-badge clickable" 
                          onclick="Weekly.goToLeagueAnalysis('${game.leagueId}', '${game.league.replace(/'/g, "\\'")}')">
                        ${game.league}
                    </span>
                </td>
                <td class="datetime-cell">${dateTimeDisplay}</td>
                <td><span class="team-cell">${game.home}</span></td>
                <td><span class="team-cell">${game.away}</span></td>
                <td>${Utils.formatDiff(game.predictedDiff)}</td>
            `;
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        return table;
    },

    formatDateTime(dateStr, timeStr) {
        // Formata data e hora para exibição, filtrando dados inválidos
        const hasValidDate = dateStr && dateStr !== '-' && !dateStr.includes('NaN');
        const hasValidTime = timeStr && timeStr !== '-' && !timeStr.includes('NaN');
        
        if (hasValidDate && hasValidTime) {
            return `${dateStr}<br><small style="color: #666;">${timeStr}</small>`;
        } else if (hasValidDate) {
            return dateStr;
        } else if (hasValidTime) {
            return `<small style="color: #666;">${timeStr}</small>`;
        } else {
            return '<span style="color: #999;">Data não disponível</span>';
        }
    },

    calculateStats(games) {
        const totalGames = games.length;
        const leagues = new Set(games.map(g => g.league)).size;
        const avgDiff = totalGames > 0 ? 
            (games.reduce((sum, g) => sum + Math.abs(g.predictedDiff), 0) / totalGames).toFixed(2) : 
            '0.00';
        
        return { totalGames, leagues, avgDiff };
    },

    async regenerateData() {
        try {
            Utils.showLoading('Atualizando dados em background...');
            
            const response = await fetch('/api/regenerate-weekly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Aguardar um pouco e recarregar
                setTimeout(() => {
                    this.loadWeeklyGames();
                }, 2000);
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            Utils.showError('Erro ao atualizar: ' + error.message);
        } finally {
            Utils.hideLoading();
        }
    },

    async goToLeagueAnalysis(leagueId, leagueName) {
        try {
            Utils.showLoading(`Analisando ${leagueName}...`);
            
            App.currentAnalysis = await API.analyzeLeague(leagueId);
            App.currentAnalysis.leagueName = leagueName;
            
            Results.display();
            Navigation.switchSection('results');
            
        } catch (error) {
            Utils.showError('Erro na análise: ' + error.message);
        } finally {
            Utils.hideLoading();
        }
    }
};

// Results section functionality
const Results = {
    init() {
        elements.resultsThresholdSlider.addEventListener('input', (e) => {
            elements.resultsThresholdValue.textContent = e.target.value;
            this.updateHighlightedGames();
        });
    },

    display() {
        if (!App.currentAnalysis) return;
        
        elements.resultsTitle.textContent = `Análise: ${App.currentAnalysis.leagueName}`;
        
        // Show/hide campaign ended warning
        if (App.currentAnalysis.campaignEnded) {
            elements.campaignEndedWarning.style.display = 'block';
        } else {
            elements.campaignEndedWarning.style.display = 'none';
        }
        
        this.displayRankings();
        this.displayNextGames();
        this.updateHighlightedGames();
    },

    displayRankings() {
        const rankings = App.currentAnalysis.rankings || [];
        
        const headers = ['Pos.', 'Time', 'Força'];
        const rows = rankings.map(team => [
            `<span class="position-cell">${team.position}</span>`,
            `<span class="team-cell">${team.team}</span>`,
            `<span class="strength-cell">${Utils.formatStrength(team.strength)}</span>`
        ]);
        
        const table = Utils.createTable(headers, rows, {
            emptyMessage: 'Nenhum dado de ranking disponível'
        });
        
        elements.rankingsTable.innerHTML = '';
        elements.rankingsTable.appendChild(table);
    },

    displayNextGames() {
        const nextGames = App.currentAnalysis.nextGames || [];
        
        const headers = ['Rodada', 'Data', 'Hora', 'Casa', 'Visitante', 'Força Casa', 'Força Visit.', 'Diff Prev.'];
        const rows = nextGames.map(game => [
            game.week || '-',
            game.date || '-',
            game.time || '-',
            `<span class="team-cell">${game.home}</span>`,
            `<span class="team-cell">${game.away}</span>`,
            Utils.formatStrength(game.homeScore),
            Utils.formatStrength(game.awayScore),
            Utils.formatDiff(game.predictedDiff)
        ]);
        
        const table = Utils.createTable(headers, rows, {
            emptyMessage: App.currentAnalysis.campaignEnded ? 
                'Campeonato finalizado - Não há próximos jogos' : 
                'Nenhum próximo jogo disponível'
        });
        
        elements.nextGamesTable.innerHTML = '';
        elements.nextGamesTable.appendChild(table);
    },

    updateHighlightedGames() {
        const threshold = parseFloat(elements.resultsThresholdSlider.value);
        const nextGames = App.currentAnalysis.nextGames || [];
        
        const highlightedGames = nextGames.filter(game => 
            Math.abs(game.predictedDiff) >= threshold
        );
        
        const headers = ['Rodada', 'Data', 'Hora', 'Casa', 'Visitante', 'Força Casa', 'Força Visit.', 'Diff Prev.'];
        const rows = highlightedGames.map(game => [
            game.week || '-',
            game.date || '-',
            game.time || '-',
            `<span class="team-cell">${game.home}</span>`,
            `<span class="team-cell">${game.away}</span>`,
            Utils.formatStrength(game.homeScore),
            Utils.formatStrength(game.awayScore),
            Utils.formatDiff(game.predictedDiff)
        ]);
        
        const table = Utils.createTable(headers, rows, {
            emptyMessage: `Nenhum jogo com diferença ≥ ${threshold}`
        });
        
        elements.highlightedGamesTable.innerHTML = '';
        elements.highlightedGamesTable.appendChild(table);
    }
};

// Error handling
const ErrorHandler = {
    init() {
        elements.errorOkBtn.addEventListener('click', () => {
            Utils.hideError();
        });
        
        elements.modalClose.addEventListener('click', () => {
            Utils.hideError();
        });
        
        // Close modal on outside click
        elements.errorModal.addEventListener('click', (e) => {
            if (e.target === elements.errorModal) {
                Utils.hideError();
            }
        });
        
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Erro global:', e.error);
            Utils.showError('Ocorreu um erro inesperado. Tente novamente.');
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejeitada:', e.reason);
            Utils.showError('Erro na comunicação com o servidor.');
        });
    }
};

// App initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Soccer Analytics Web App iniciando...');
    
    // Initialize all modules
    Navigation.init();
    Home.init();
    Weekly.init();
    Results.init();
    ErrorHandler.init();
    
    // Set initial state
    Navigation.switchSection('home');
    
    console.log('✅ App inicializado com sucesso!');
});