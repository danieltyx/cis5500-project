import React, { useEffect, useState } from "react";
import "../style/LopsidedGames.css";

const config = require('../config.json');

const LopsidedGames = () => {
  const [games, setGames] = useState([]);

  // Get data from api on load
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/lopsided_games`)
      .then((res) => res.json())
      .then((data) => {console.log(data.rows); setGames(data.rows)})
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="most-lopsided-games">
      {/* Table to display all lopsided games */}
      <h3 className="lopsided-games-heading">Most Lopsided Games (by Goal Differential)</h3>
      <div className="lopsided-container">
        <table className="lopsided-table">
          <thead>
            <tr>
              <th>Season</th>
              <th>Game</th>
              <th>Final Score</th>
              <th>Goal Differential</th>
              <th>Home Shots</th>
              <th>Away Shots</th>
            </tr>
          </thead>
        </table>
        <div className="lopsided-body">
          <table className="lopsided-table">
            <tbody>
              {games.map((game) => {
                // Color code based on if home team wins vs away team wins
                let bgColor = "#ffffff";
                if (game.home_goals > game.away_goals) bgColor = "#d4f5e6";
                else if (game.home_goals < game.away_goals) bgColor = "#ffe3dc";
                else bgColor = "#f0f0f0";

                return (
                  <tr key={game.game_id} style={{ backgroundColor: bgColor }}>
                    <td>{String(game.season).substring(0, 4)}/{String(game.season).substring(4)}</td>
                    <td>{game.home_team_name} vs {game.away_team_name}</td>
                    <td>{game.home_goals} - {game.away_goals}</td>
                    <td>{game.goal_diff}</td>
                    <td>{game.home_shots}</td>
                    <td>{game.away_shots}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LopsidedGames;
