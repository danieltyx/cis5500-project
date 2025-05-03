import { useEffect, useState } from 'react';
import './PlayersPage.css';

const config = require('../config.json');

export default function PlayersPage() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [heightRange, setHeightRange] = useState([160, 210]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/players`)
      .then(res => res.json())
      .then(resJson => {
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
        const playersWithId = resJson.rows.map((p) => ({ id: p.player_id, ...p }));
        setData(playersWithId);
      });
  };

  return (
    <div className="container">
      <h2>Search Players</h2>
      <div className="form-grid">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Position (ex: C, LW, RW, D, G)" value={position} onChange={(e) => setPosition(e.target.value)} />
        <input placeholder="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
        <input placeholder="Birth City" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} />
        <div className="height-input-container">
          <label>Height Range (cm):</label><br />
          <input
            type="number"
            min="140"
            max="220"
            value={heightRange[0]}
            onChange={(e) => setHeightRange([parseInt(e.target.value), heightRange[1]])}
            placeholder="Min Height"
            style={{ width: '100px', marginRight: '10px' }}
          />
          <input
            type="number"
            min="140"
            max="220"
            value={heightRange[1]}
            onChange={(e) => setHeightRange([heightRange[0], parseInt(e.target.value)])}
            placeholder="Max Height"
            style={{ width: '100px' }}
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
              <td>{player.last_name}</td>
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
