import pandas as pd

# Cleaning game_plays_players.csv
# Access our data and fill in na data
df = pd.read_csv('game_plays_players.csv')
df.drop_duplicates(inplace=True)
df.dropna(subset=['player_id', 'game_id', 'play_id'], inplace=True)
df.to_csv('game_plays_players.csv', index=False)

# Cleaning game_plays.csv
df = pd.read_csv('game_plays.csv')
df.drop_duplicates(inplace=True)
df.dropna(subset=['play_id', 'game_id'], inplace=True)
df.to_csv('game_plays.csv', index=False)

# Cleaning player_info.csv
df = pd.read_csv('player_info.csv')
df.drop_duplicates(inplace=True)
df.dropna(subset=['player_id'], inplace=True)
df.to_csv('player_info.csv', index=False)

# Cleaning team_info.csv
df = pd.read_csv('team_info.csv')
df.drop_duplicates(inplace=True)
df.dropna(subset=['team_id'], inplace=True)
df['teamName'] = df['teamName'].str.strip().str.lower()
df.to_csv('team_info.csv', index=False)
