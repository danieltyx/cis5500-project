import { useEffect, useState } from 'react';
import PlayerCard from '../components/PlayerCard';
const config = require('../config.json');

export default function PlayersPage() {
  const [data, setData] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [heightRange, setHeightRange] = useState([160, 210]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/players`)
      .then(res => res.json())
      .then(resJson => {
        console.log('Player data:', resJson);
        const playersWithId = resJson.rows.map((p) => ({ id: p.player_id, ...p }));
        setData(playersWithId);
      });
  }, []);

  const search = () => {
    const queryParams = new URLSearchParams({
      name,
      position,
      nationality,
      birth_city: birthCity,
      height_low: heightRange[0],
      height_high: heightRange[1],
    });

    fetch(`http://${config.server_host}:${config.server_port}/search_players?${queryParams.toString()}`)
      .then(res => res.json())
      .then(resJson => {
        const playersWithId = resJson.map((p) => ({ id: p.player_id, ...p }));
        setData(playersWithId);
      });
  };

  return (
    <div className="container">
      {selectedPlayerId && <PlayerCard playerId={selectedPlayerId} handleClose={() => setSelectedPlayerId(null)} />}
      <h2>Search Players</h2>
      <div className="form-grid">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
        <input placeholder="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
        <input placeholder="Birth City" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} />
        <div className="slider-container">
          <label>Height Range (cm): {heightRange[0]} - {heightRange[1]}</label><br />
          <input
            type="range"
            min="140"
            max="220"
            step="1"
            value={heightRange[0]}
            onChange={(e) => setHeightRange([parseInt(e.target.value), heightRange[1]])}
          />
          <input
            type="range"
            min="140"
            max="220"
            step="1"
            value={heightRange[1]}
            onChange={(e) => setHeightRange([heightRange[0], parseInt(e.target.value)])}
          />
        </div>
        <button onClick={search} className="search-button">Search</button>
      </div>

      <h2>Results</h2>
      <table className="player-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Position</th>
            <th>Nationality</th>
            <th>Birth City</th>
            <th>Birth Date</th>
            <th>Height (cm)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(player => (
            <tr key={player.player_id}>
              <td>{player.first_name}</td>
              <td>
                <button className="link-button" onClick={() => setSelectedPlayerId(player.player_id)}>
                  {player.last_name}
                </button>
              </td>
              <td>{player.primary_position}</td>
              <td>{player.nationality}</td>
              <td>{player.birth_city}</td>
              <td>{new Date(player.birth_date).toLocaleDateString()}</td>
              <td>{player.height_cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
