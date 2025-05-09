import '../style/GamesPage.css';

export default function GamesTable({ games }) {
  return (
    // Table to display all games based on what was returned from the api call
    <table className="games-table">
      <thead>
        <tr>
          <th>Season</th>
          <th>Date</th>
          <th>Type</th>
          <th>Home Team</th>
          <th>Away Team</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {games.map(game => {
          const isTie = game.home_goals === game.away_goals;
          const isHomeWin = game.home_goals > game.away_goals;
          const rowClass = isTie ? 'tie-row' : (isHomeWin ? 'home-win-row' : 'away-win-row');

          return (
            <tr key={game.game_id} className={rowClass}>
              <td>{String(game.season).substring(0, 4)}/{String(game.season).substring(4)}</td>
              <td>
                {new Date(game.date_time_gmt).toDateString()}{" "}
                {new Date(game.date_time_gmt).toLocaleTimeString()}
              </td>
              <td>{game.enum}</td>
              <td>{game.home_team_name}</td>
              <td>{game.away_team_name}</td>
              <td>{game.home_goals} - {game.away_goals}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
