import numpy as np
import pandas as pd
import sys
import os
import glob

# Configurar encoding para evitar erros Unicode
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def find_csv_files():
    """Encontra todos os arquivos CSV na pasta data e retorna pares (arquivo_geral, arquivo_next)"""
    data_dir = 'data'
    if not os.path.exists(data_dir):
        print(f'Diretório {data_dir} não encontrado.')
        return []
    
    # Encontrar todos os arquivos principais (sem _next)
    main_files = glob.glob(os.path.join(data_dir, '*-*.csv'))
    main_files = [f for f in main_files if not f.endswith('_next.csv')]
    
    csv_pairs = []
    for main_file in main_files:
        # Construir o nome do arquivo _next correspondente
        base_name = main_file[:-4]  # Remove .csv
        next_file = base_name + '_next.csv'
        
        if os.path.exists(next_file):
            # Extrair país e liga do nome do arquivo
            filename = os.path.basename(main_file)[:-4]  # Remove .csv e path
            if '-' in filename:
                pais, liga = filename.split('-', 1)
                csv_pairs.append({
                    'pais': pais,
                    'liga': liga,
                    'main_file': main_file,
                    'next_file': next_file,
                    'identifier': filename
                })
    
    return csv_pairs

def list_available_leagues():
    """Lista todas as ligas disponíveis"""
    csv_pairs = find_csv_files()
    if not csv_pairs:
        print("Nenhum arquivo CSV encontrado na pasta data.")
        return
    
    print("Ligas disponíveis:")
    print("=" * 50)
    for i, pair in enumerate(csv_pairs, 1):
        main_size = os.path.getsize(pair['main_file'])
        next_size = os.path.getsize(pair['next_file'])
        print(f"{i:2d}. {pair['pais'].upper()} - {pair['liga']}")
        print(f"    Arquivo principal: {main_size} bytes")
        print(f"    Próximos jogos: {next_size} bytes")
        print()

if len(sys.argv) > 1:
    if sys.argv[1] == '--list' or sys.argv[1] == '-l':
        list_available_leagues()
        sys.exit()
    elif len(sys.argv) >= 3:
        # Formato: python chance.py pais liga
        pais = sys.argv[1]
        liga = sys.argv[2]
        identifier = f"{pais}-{liga}"
        
        # Buscar arquivo com prefixo numérico na pasta data
        import glob
        data_dir = 'data'
        pattern = f"{data_dir}/*-{identifier}.csv"
        matching_files = glob.glob(pattern)
        
        if matching_files:
            file_path = matching_files[0]  # Pegar o primeiro arquivo encontrado
            # Extrair o nome base do arquivo para construir o _next
            base_name = file_path.replace('.csv', '')
            new_file_path = f"{base_name}_next.csv"
        else:
            print(f'ERRO: Nenhum arquivo encontrado para padrão {pattern}')
            print('Use --list para ver as ligas disponíveis.')
            sys.exit(1)
    else:
        # Formato antigo: python chance.py pais-liga (com prefixo)
        identifier = sys.argv[1]
        file_path = f'data/{identifier}.csv'
        new_file_path = f'data/{identifier}_next.csv'
    
    if not os.path.exists(file_path):
        print(f'ERRO: Arquivo {file_path} não encontrado.')
        print('Use --list para ver as ligas disponíveis.')
        sys.exit(1)
    elif not os.path.exists(new_file_path):
        print(f'ERRO: Arquivo {new_file_path} não encontrado.')
        print('Use --list para ver as ligas disponíveis.')
        sys.exit(1)
    else:
        print(f'SUCCESS: Arquivo {file_path} encontrado.')
        print(f'SUCCESS: Arquivo {new_file_path} encontrado.')
else:
    print('Uso:')
    print('  python chance.py <pais> <liga>     # Exemplo: python chance.py BRA "Campeonato Brasileiro Série A"')
    print('  python chance.py <pais-liga>       # Exemplo: python chance.py BRA-Serie_A')
    print('  python chance.py --list            # Lista todas as ligas disponíveis')
    sys.exit(1)

pd.set_option("display.precision", 2)

def safe_print(text):
    """Função para imprimir texto de forma segura, removendo caracteres problemáticos se necessário"""
    try:
        print(text)
    except UnicodeEncodeError:
        # Remover caracteres especiais se houver erro
        safe_text = text.encode('ascii', 'ignore').decode('ascii')
        print(safe_text)

def build_system_from_csv(file_path):
    """Constrói o sistema linear a partir do arquivo CSV"""
    try:
        # Ler o arquivo CSV
        df = pd.read_csv(file_path, sep=';', encoding='utf-8')
        
        # Verificar se as colunas necessárias existem
        required_columns = ['HOME', 'AWAY', 'DIFF']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            safe_print(f"ERRO: Colunas faltando no arquivo: {missing_columns}")
            safe_print(f"Colunas disponíveis: {list(df.columns)}")
            return None, None, None
        
        # Filtrar apenas jogos com resultados (DIFF não nulo)
        df = df.dropna(subset=['DIFF'])
        
        if len(df) == 0:
            safe_print("ERRO: Nenhum jogo com resultado encontrado no arquivo.")
            return None, None, None
        
        # Extrair as colunas necessárias
        home_teams = df['HOME'].values
        away_teams = df['AWAY'].values
        diffs = df['DIFF'].values

        # Coletar todas as variáveis (times)
        variables = set(home_teams).union(set(away_teams))
        variables = sorted(variables)
        num_vars = len(variables)
        var_index = {var: idx for idx, var in enumerate(variables)}

        # Construir a matriz A e o vetor b
        A = np.zeros((len(df), num_vars))
        b = np.zeros(len(df))

        for i in range(len(df)):
            home_team = home_teams[i]
            away_team = away_teams[i]
            diff = diffs[i]
            A[i, var_index[home_team]] = 1
            A[i, var_index[away_team]] = -1
            b[i] = diff

        return A, b, variables
    except Exception as e:
        safe_print(f"ERRO: Erro ao processar arquivo {file_path}: {e}")
        return None, None, None

def solve_system_from_csv(file_path):
    """Resolve o sistema linear a partir do arquivo CSV"""
    A, b, variables = build_system_from_csv(file_path)
    if A is None:
        return None
    
    try:
        x, residuals, rank, s = np.linalg.lstsq(A, b, rcond=None)
        solution = {variables[i]: x[i] for i in range(len(variables))}
        return solution
    except Exception as e:
        safe_print(f"ERRO: Erro ao resolver sistema linear: {e}")
        return None

def add_scores_to_new_csv(solution, new_file_path):
    """Adiciona pontuações dos times ao arquivo de próximos jogos"""
    try:
        # Ler o novo arquivo CSV
        df_new = pd.read_csv(new_file_path, sep=';', encoding='utf-8')
        
        if len(df_new) == 0:
            safe_print("INFO: Arquivo de próximos jogos está vazio (campeonato pode ter terminado).")
            return pd.DataFrame()
        
        # Verificar se as colunas necessárias existem
        if 'HOME' not in df_new.columns or 'AWAY' not in df_new.columns:
            safe_print(f"ERRO: Colunas HOME/AWAY não encontradas no arquivo {new_file_path}")
            safe_print(f"Colunas disponíveis: {list(df_new.columns)}")
            return df_new

        # Adicionar colunas com as pontuações dos times e a diff
        df_new['HOME_SCORE'] = df_new['HOME'].map(solution)
        df_new['AWAY_SCORE'] = df_new['AWAY'].map(solution)
        
        # Calcular diferença prevista
        df_new['PREDICTED_DIFF'] = df_new['HOME_SCORE'] - df_new['AWAY_SCORE']
        df_new['PREDICTED_DIFF'] = df_new['PREDICTED_DIFF'].round(2)

        return df_new
    except Exception as e:
        safe_print(f"ERRO: Erro ao processar arquivo {new_file_path}: {e}")
        return pd.DataFrame()

# Processar os arquivos
print("ANALYSIS_START")
print("=" * 60)
print(f"ANÁLISE DE FORÇA DOS TIMES")
print("=" * 60)

# Resolver o sistema a partir do arquivo CSV
solution = solve_system_from_csv(file_path)

if solution is None:
    safe_print("ERRO: Erro ao calcular as forças dos times.")
    sys.exit(1)

# Ordenar por força (ranking)
solution_sorted = {k: v for k, v in sorted(solution.items(), key=lambda item: item[1], reverse=True)}

print(f"\nRANKING_START")
print(f"FORÇA DOS TIMES (Ranking por força):")
print("-" * 40)
for i, (team, value) in enumerate(solution_sorted.items(), 1):
    try:
        # Tentar imprimir normalmente
        print(f"{i:2d}. {team:<25} = {value:6.2f}")
    except UnicodeEncodeError:
        # Se falhar, usar versão ASCII
        safe_team = team.encode('ascii', 'ignore').decode('ascii')
        print(f"{i:2d}. {safe_team:<25} = {value:6.2f}")
print("RANKING_END")

# Adicionar pontuações e diffs ao novo CSV
df_with_scores = add_scores_to_new_csv(solution, new_file_path)

if not df_with_scores.empty:
    print(f"\nNEXT_GAMES_START")
    print(f"PRÓXIMOS JOGOS COM PREVISÕES:")
    print("-" * 80)
    
    # Cabeçalho das colunas
    print(f"{'WEEK':<6} {'DATE':<12} {'TIME':<8} {'HOME':<20} {'AWAY':<20} {'HOME_SCORE':<12} {'AWAY_SCORE':<12} {'PREDICTED_DIFF':<15}")
    print("-" * 110)
    
    # Dados dos jogos
    for _, row in df_with_scores.iterrows():
        week = str(row.get('WEEK', '-'))[:5]
        date = str(row.get('DATE', '-'))[:11]
        time = str(row.get('TIME', '-'))[:7]
        home = str(row.get('HOME', '-'))[:19]
        away = str(row.get('AWAY', '-'))[:19]
        home_score = row.get('HOME_SCORE', 0)
        away_score = row.get('AWAY_SCORE', 0)
        pred_diff = row.get('PREDICTED_DIFF', 0)
        
        try:
            print(f"{week:<6} {date:<12} {time:<8} {home:<20} {away:<20} {home_score:<12.2f} {away_score:<12.2f} {pred_diff:<15.2f}")
        except UnicodeEncodeError:
            safe_home = home.encode('ascii', 'ignore').decode('ascii')
            safe_away = away.encode('ascii', 'ignore').decode('ascii')
            print(f"{week:<6} {date:<12} {time:<8} {safe_home:<20} {safe_away:<20} {home_score:<12.2f} {away_score:<12.2f} {pred_diff:<15.2f}")
    
    print("NEXT_GAMES_END")
    
    # Filtrar jogos com diferença significativa (>= 1.5)
    if 'PREDICTED_DIFF' in df_with_scores.columns:
        df_with_scores['PREDICTED_DIFF'] = pd.to_numeric(df_with_scores['PREDICTED_DIFF'], errors='coerce')
        df_filtered = df_with_scores[abs(df_with_scores['PREDICTED_DIFF']) >= 1.5]
        
        if not df_filtered.empty:
            print(f"\nHIGHLIGHTED_GAMES_START")
            print(f"JOGOS COM DIFERENÇA SIGNIFICATIVA (|diff| >= 1.5):")
            print("-" * 80)
            
            # Cabeçalho das colunas
            print(f"{'WEEK':<6} {'DATE':<12} {'TIME':<8} {'HOME':<20} {'AWAY':<20} {'HOME_SCORE':<12} {'AWAY_SCORE':<12} {'PREDICTED_DIFF':<15}")
            print("-" * 110)
            
            # Dados dos jogos filtrados
            for _, row in df_filtered.iterrows():
                week = str(row.get('WEEK', '-'))[:5]
                date = str(row.get('DATE', '-'))[:11]
                time = str(row.get('TIME', '-'))[:7]
                home = str(row.get('HOME', '-'))[:19]
                away = str(row.get('AWAY', '-'))[:19]
                home_score = row.get('HOME_SCORE', 0)
                away_score = row.get('AWAY_SCORE', 0)
                pred_diff = row.get('PREDICTED_DIFF', 0)
                
                try:
                    print(f"{week:<6} {date:<12} {time:<8} {home:<20} {away:<20} {home_score:<12.2f} {away_score:<12.2f} {pred_diff:<15.2f}")
                except UnicodeEncodeError:
                    safe_home = home.encode('ascii', 'ignore').decode('ascii')
                    safe_away = away.encode('ascii', 'ignore').decode('ascii')
                    print(f"{week:<6} {date:<12} {time:<8} {safe_home:<20} {safe_away:<20} {home_score:<12.2f} {away_score:<12.2f} {pred_diff:<15.2f}")
            
            print("HIGHLIGHTED_GAMES_END")
        else:
            print(f"\nHIGHLIGHTED_GAMES_START")
            print(f"Nenhum jogo com diferença significativa (|diff| >= 1.5) encontrado.")
            print("HIGHLIGHTED_GAMES_END")
else:
    print(f"\nCAMPAIGN_ENDED")
    print(f"Nenhum próximo jogo encontrado (campeonato pode ter terminado).")

print("\nANALYSIS_END")
print("=" * 60)