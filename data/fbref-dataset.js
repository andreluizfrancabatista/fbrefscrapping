const dataset = {
    "ENG": {
        "Premier League": "https://fbref.com/en/comps/9/schedule/Premier-League-Scores-and-Fixtures",
        "FA Women's Super League": "https://fbref.com/en/comps/189/schedule/Womens-Super-League-Scores-and-Fixtures",
        "EFL Championship": "https://fbref.com/en/comps/10/schedule/Championship-Scores-and-Fixtures",
        "EFL League One": "https://fbref.com/en/comps/15/schedule/League-One-Scores-and-Fixtures",
        "EFL League Two": "https://fbref.com/en/comps/16/schedule/League-Two-Scores-and-Fixtures",
        "National League": "https://fbref.com/en/comps/34/schedule/National-League-Scores-and-Fixtures"
    },
    "ESP": {
        "La Liga": "https://fbref.com/en/comps/12/schedule/La-Liga-Scores-and-Fixtures",
        "Liga F": "https://fbref.com/en/comps/230/schedule/Liga-F-Scores-and-Fixtures",
        "Spanish Segunda División": "https://fbref.com/en/comps/17/schedule/Segunda-Division-Scores-and-Fixtures"
    },
    "FRA": {
        "Ligue 1": "https://fbref.com/en/comps/13/schedule/Ligue-1-Scores-and-Fixtures",
        "Première Ligue": "https://fbref.com/en/comps/193/schedule/Premiere-Ligue-Scores-and-Fixtures",
        "Ligue 2": "https://fbref.com/en/comps/60/schedule/Ligue-2-Scores-and-Fixtures"
    },
    "GER": {
        "Fußball-Bundesliga": "https://fbref.com/en/comps/20/schedule/Bundesliga-Scores-and-Fixtures",
        "Frauen-Bundesliga": "https://fbref.com/en/comps/183/schedule/Frauen-Bundesliga-Scores-and-Fixtures",
        "2. Fußball-Bundesliga": "https://fbref.com/en/comps/33/schedule/2-Bundesliga-Scores-and-Fixtures",
        "3. Fußball-Liga": "https://fbref.com/en/comps/59/schedule/3-Liga-Scores-and-Fixtures"
    },
    "ITA": {
        "Serie A": "https://fbref.com/en/comps/208/schedule/Serie-A-Scores-and-Fixtures",
        "Serie B": "https://fbref.com/en/comps/18/schedule/Serie-B-Scores-and-Fixtures"
    },
    "ARG": {
        "Liga Profesional de Fútbol Argentina": "https://fbref.com/en/comps/21/schedule/Liga-Profesional-Argentina-Scores-and-Fixtures"
    },
    "AUS": {
        "A-League Men": "https://fbref.com/en/comps/65/schedule/A-League-Men-Scores-and-Fixtures",
        "A-League Women": "https://fbref.com/en/comps/196/schedule/A-League-Women-Scores-and-Fixtures"
    },
    "AUT": {
        "Austrian Football Bundesliga": "https://fbref.com/en/comps/56/schedule/Austrian-Bundesliga-Scores-and-Fixtures",
        "ÖFB Frauen-Bundesliga": "https://fbref.com/en/comps/286/schedule/OFB-Frauen-Bundesliga-Scores-and-Fixtures"
    },
    "BEL": {
        "Belgian Pro League": "https://fbref.com/en/comps/37/schedule/Belgian-Pro-League-Scores-and-Fixtures",
        "Belgian Women's Super League": "https://fbref.com/en/comps/296/schedule/Belgian-Womens-Super-League-Scores-and-Fixtures",
        "Challenger Pro League": "https://fbref.com/en/comps/69/schedule/Challenger-Pro-League-Scores-and-Fixtures"
    },
    "BOL": {
        "División de Fútbol Profesional": "https://fbref.com/en/comps/74/schedule/Bolivian-Primera-Division-Scores-and-Fixtures"
    },
    "BRA": {
        "Campeonato Brasileiro Série A": "https://fbref.com/en/comps/24/schedule/Serie-A-Scores-and-Fixtures",
        "Brasileirão Feminino Série A1": "https://fbref.com/en/comps/206/schedule/Serie-A1-Scores-and-Fixtures",
        "Campeonato Brasileiro Série B": "https://fbref.com/en/comps/38/schedule/Serie-B-Scores-and-Fixtures"
    },
    "BUL": {
        "First Professional Football League": "https://fbref.com/en/comps/67/schedule/Bulgarian-First-League-Scores-and-Fixtures"
    },
    "CAN": {
        "Canadian Premier League": "https://fbref.com/en/comps/211/schedule/Canadian-Premier-League-Scores-and-Fixtures"
    },
    "CHI": {
        "Chilean Primera División": "https://fbref.com/en/comps/35/schedule/Chilean-Primera-Division-Scores-and-Fixtures"
    },
    "CHN": {
        "Chinese Football Association Super League": "https://fbref.com/en/comps/62/schedule/Chinese-Super-League-Scores-and-Fixtures"
    },
    "COL": {
        "Categoría Primera A": "https://fbref.com/en/comps/41/schedule/Primera-A-Scores-and-Fixtures"
    },
    "CRO": {
        "Croatian Football League": "https://fbref.com/en/comps/63/schedule/Hrvatska-NL-Scores-and-Fixtures"
    },
    "CZE": {
        "Czech First League": "https://fbref.com/en/comps/66/schedule/Czech-First-League-Scores-and-Fixtures"
    },
    "DEN": {
        "Danish Superliga": "https://fbref.com/en/comps/50/schedule/Danish-Superliga-Scores-and-Fixtures",
        "Danish Women's League": "https://fbref.com/en/comps/340/schedule/Kvindeligaen-Scores-and-Fixtures"
    },
    "ECU": {
        "Liga Profesional Ecuador": "https://fbref.com/en/comps/58/schedule/Serie-A-Scores-and-Fixtures"
    },
    "FIN": {
        "Veikkausliiga": "https://fbref.com/en/comps/43/schedule/Veikkausliiga-Scores-and-Fixtures"
    },
    "GRE": {
        "Super League Greece": "https://fbref.com/en/comps/27/schedule/Super-League-Greece-Scores-and-Fixtures"
    },
    "HUN": {
        "Nemzeti Bajnokság I": "https://fbref.com/en/comps/46/schedule/NB-I-Scores-and-Fixtures"
    },
    "IND": {
        "Indian Super League": "https://fbref.com/en/comps/82/schedule/Indian-Super-League-Scores-and-Fixtures",
        "I-League": "https://fbref.com/en/comps/378/schedule/I-League-Scores-and-Fixtures"
    },
    "IRN": {
        "Persian Gulf Pro League": "https://fbref.com/en/comps/64/schedule/Persian-Gulf-Pro-League-Scores-and-Fixtures"
    },
    "JPN": {
        "J1 League": "https://fbref.com/en/comps/25/schedule/J1-League-Scores-and-Fixtures",
        "Women Empowerment League": "https://fbref.com/en/comps/893/schedule/WE-League-Scores-and-Fixtures",
        "J2 League": "https://fbref.com/en/comps/49/schedule/J2-League-Scores-and-Fixtures"
    },
    "KOR": {
        "K League 1": "https://fbref.com/en/comps/55/schedule/K-League-1-Scores-and-Fixtures"
    },
    "KSA": {
        "Saudi Professional League": "https://fbref.com/en/comps/70/schedule/Saudi-Professional-League-Scores-and-Fixtures"
    },
    "MEX": {
        "Liga MX": "https://fbref.com/en/comps/31/schedule/Liga-MX-Scores-and-Fixtures"
    },
    "NED": {
        "Eredivisie": "https://fbref.com/en/comps/23/schedule/Eredivisie-Scores-and-Fixtures",
        "Eredivisie Vrouwen": "https://fbref.com/en/comps/195/schedule/Eredivisie-Vrouwen-Scores-and-Fixtures",
        "Eerste Divisie": "https://fbref.com/en/comps/51/schedule/Eerste-Divisie-Scores-and-Fixtures"
    },
    "NOR": {
        "Eliteserien": "https://fbref.com/en/comps/28/schedule/Eliteserien-Scores-and-Fixtures",
        "Toppserien": "https://fbref.com/en/comps/185/schedule/Toppserien-Scores-and-Fixtures"
    },
    "PAR": {
        "Paraguayan Primera División": "https://fbref.com/en/comps/61/schedule/Primera-Division-Scores-and-Fixtures"
    },
    "PER": {
        "Liga 1 de Fútbol Profesional": "https://fbref.com/en/comps/44/schedule/Liga-1-Scores-and-Fixtures"
    },
    "POL": {
        "Ekstraklasa": "https://fbref.com/en/comps/36/schedule/Ekstraklasa-Scores-and-Fixtures"
    },
    "POR": {
        "Primeira Liga": "https://fbref.com/en/comps/32/schedule/Primeira-Liga-Scores-and-Fixtures"
    },
    "ROU": {
        "Liga I": "https://fbref.com/en/comps/47/schedule/Liga-I-Scores-and-Fixtures"
    },
    "RSA": {
        "South African Premier Division": "https://fbref.com/en/comps/52/schedule/Premier-Division-Scores-and-Fixtures"
    },
    "RUS": {
        "Russian Premier League": "https://fbref.com/en/comps/30/schedule/Russian-Premier-League-Scores-and-Fixtures"
    },
    "SCO": {
        "Scottish Premiership": "https://fbref.com/en/comps/40/schedule/Scottish-Premiership-Scores-and-Fixtures",
        "Scottish Championship": "https://fbref.com/en/comps/72/schedule/Scottish-Championship-Scores-and-Fixtures"
    },
    "SRB": {
        "Serbian SuperLiga": "https://fbref.com/en/comps/54/schedule/Serbian-SuperLiga-Scores-and-Fixtures"
    },
    "SUI": {
        "Swiss Super League": "https://fbref.com/en/comps/57/schedule/Swiss-Super-League-Scores-and-Fixtures",
        "Swiss Women's Super League": "https://fbref.com/en/comps/894/schedule/Swiss-Womens-Super-League-Scores-and-Fixtures"
    },
    "SWE": {
        "Allsvenskan": "https://fbref.com/en/comps/29/schedule/Allsvenskan-Scores-and-Fixtures",
        "Damallsvenskan": "https://fbref.com/en/comps/187/schedule/Damallsvenskan-Scores-and-Fixtures",
        "Superettan": "https://fbref.com/en/comps/48/schedule/Superettan-Scores-and-Fixtures"
    },
    "TUR": {
        "Süper Lig": "https://fbref.com/en/comps/26/schedule/Super-Lig-Scores-and-Fixtures"
    },
    "UKR": {
        "Ukrainian Premier League": "https://fbref.com/en/comps/39/schedule/Ukrainian-Premier-League-Scores-and-Fixtures"
    },
    "URU": {
        "Uruguayan Primera División": "https://fbref.com/en/comps/45/schedule/Uruguayan-Primera-Division-Scores-and-Fixtures"
    },
    "USA": {
        "Major League Soccer": "https://fbref.com/en/comps/22/schedule/Major-League-Soccer-Scores-and-Fixtures",
        "National Women's Soccer League": "https://fbref.com/en/comps/182/schedule/NWSL-Scores-and-Fixtures",
        "USL Championship": "https://fbref.com/en/comps/73/schedule/USL-Championship-Scores-and-Fixtures",
        "USL League One": "https://fbref.com/en/comps/137/schedule/USL-League-One-Scores-and-Fixtures"
    },
    "VEN": {
        "Venezuelan Primera División": "https://fbref.com/en/comps/105/schedule/Venezuelan-Primera-Division-Scores-and-Fixtures"
    }
};

module.exports = dataset;
