import React, { useEffect, useState } from "react";
import "../style/ExperiencedWinnerLocations.css";

const config = require('../config.json');
const normalize = (val, min, max) => ((val - min) / (max - min)) * 100;

const ExperiencedWinnerLocations = () => {
  const [locations, setLocations] = useState([]);
  const [hoveredDot, setHoveredDot] = useState(null);
  const xMin = -7.2, xMax = 7.2;
  const yMin = -4, yMax = 4;

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/exp_winner_xy`)
      .then((res) => res.json())
      .then((data) => setLocations(data.rows))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ padding: '20px', marginTop: '0px' }}>
      <h2>Event Summary Table</h2>
      <table className="player-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Avg X</th>
            <th>Avg Y</th>
            <th>Total Events</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((row, i) => (
            <tr key={i}>
              <td>{row.event}</td>
              <td>{parseFloat(row.avg_x).toFixed(2)}</td>
              <td>{parseFloat(row.avg_y).toFixed(2)}</td>
              <td>{Number(row.total_events).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Event Locations Map</h2>
      <div className="rink-container">
        {locations.map((point, i) => {
          const left = normalize(parseFloat(point.avg_x), xMin, xMax);
          const top = 100 - normalize(parseFloat(point.avg_y), yMin, yMax);
          const size = Math.log(parseInt(point.total_events)) * 1.5;

          return (
            <div
              key={i}
              className="dot"
              style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
              onMouseEnter={() => setHoveredDot({ event: point.event, left, top })}
              onMouseLeave={() => setHoveredDot(null)}
            />
          );
        })}

        {hoveredDot && (
          <div
            className="tooltip"
            style={{
              left: `${hoveredDot.left}%`,
              top: `${hoveredDot.top}%`,
            }}
          >
            {hoveredDot.event}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencedWinnerLocations;
