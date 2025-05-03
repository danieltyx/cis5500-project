import '../style/GamesPage.css';

export default function GamesTable({ games }) {
  return (
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
        {games.map(game => (
          <tr
            key={game.game_id}
          >
            <td>{game.season}</td>
            <td>{game.date_time_gmt}</td>
            <td>{game.enum}</td>
            <td>{game.home_team_name}</td>
            <td>{game.away_team_name}</td>
            <td>{game.home_goals} - {game.away_goals}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
