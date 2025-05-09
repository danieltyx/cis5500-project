import React, { useEffect, useState } from "react";
import "../style/ExperiencedWinnerLocations.css";

const config = require("../config.json");
const normalize = (val, min, max) => ((val - min) / (max - min)) * 100;
const eventAbbreviations = {
  Goal: "GOL",
  Giveaway: "GVY",
  Shot: "S",
  Hit: "H",
  Takeaway: "TKY",
  "Blocked Shot": "B",
  "Missed Shot": "M",
  Faceoff: "F",
  Penalty: "P",
};

const ExperiencedWinnerLocations = () => {
  const [locations, setLocations] = useState([]);
  const xMin = -11,
    xMax = 11;
  const yMin = -4,
    yMax = 4;

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/exp_winner_xy`)
      .then((res) => res.json())
      .then((data) => setLocations(data.rows))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="experienced-winners">
      <h2 className="header">Event Summary Table</h2>
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
          const size = Math.log(parseInt(point.total_events)) * 2;
          const abbr =
            eventAbbreviations[point.event] ||
            point.event.slice(0, 3).toUpperCase();

          return (
            <div
              key={i}
              className="dot-labeled"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
              }}
            >
              <span className="dot-label">{abbr}</span>
            </div>
          );
        })}
      </div>

      <div className="legend-box">
        <h3>Legend</h3>
        <div className="legend-grid">
          {Object.entries(eventAbbreviations).map(([event, abbr], i) => (
            <div key={i} className="legend-item">
              <div className="legend-dot" />
              <span>
                {abbr}: {event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperiencedWinnerLocations;
