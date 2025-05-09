import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../style/GameShotTypes.css";

const config = require("../config.json");

const ShotTypeStats = () => {
  const [data, setData] = useState([]);
  // Calculates the percentage of goals out of all shots taken
  const enrichedData = data.map((row) => ({
    ...row,
    winner_conversion:
      row.winner_shots > 0
        ? ((row.winner_goals / row.winner_shots) * 100).toFixed(1)
        : "0.0",
    loser_conversion:
      row.loser_shots > 0
        ? ((row.loser_goals / row.loser_shots) * 100).toFixed(1)
        : "0.0",
  }));

  // For toggle between shot data and goal data
  const [viewMode, setViewMode] = useState("shots");
  const isShots = viewMode === "shots";

  // Gets data as page loads
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/shot_types`)
      .then((res) => res.json())
      .then((resJson) => setData(resJson.rows))
      .catch(console.error);
  }, []);

  return (
    <div className="shot-type">
      <h3 className="shot-performance-heading">Shot Type Performance</h3>
      {/* Table to display the different shot types and their statistics */}
      <table className="shots-table mb-8">
        <thead>
          <tr>
            <th>Shot Type</th>
            <th>Winner Shots</th>
            <th>Winner Goals</th>
            <th>Winner %</th>
            <th>Loser Shots</th>
            <th>Loser Goals</th>
            <th>Loser %</th>
          </tr>
        </thead>
        <tbody>
          {enrichedData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.shot_type || "Unknown"}</td>
              <td>{row.winner_shots}</td>
              <td>{row.winner_goals}</td>
              <td>{row.winner_conversion}%</td>
              <td>{row.loser_shots}</td>
              <td>{row.loser_goals}</td>
              <td>{row.loser_conversion}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      {/* Radio button to either display shot statistics and goal statistics */}
      <h3 className="text-lg font-semibold mb-2">
        Bar Chart Comparison ({isShots ? "Shots" : "Goals"})
      </h3>
      <label className="mr-4 text-sm">
        <input
          type="radio"
          value="shots"
          checked={viewMode === "shots"}
          onChange={(e) => setViewMode(e.target.value)}
          className="mr-1"
        />
        Show Shots
      </label>
      <label className="text-sm">
        <input
          type="radio"
          value="goals"
          checked={viewMode === "goals"}
          onChange={(e) => setViewMode(e.target.value)}
          className="mr-1"
        />
        Show Goals
      </label>

      {/* Bar Chart that either displays shot stats, or goal statistics grouped by shot types */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <XAxis dataKey="shot_type" tick={{ fontSize: 10 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            domain={[0, isShots ? 14000 : 2000]}
            ticks={
              isShots
                ? [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]
                : [0, 500, 1000, 1500, 2000]
            }
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Tooltip />
          {isShots ? (
            <>
              <Bar dataKey="winner_shots" fill="#4CAF50" />
              <Bar dataKey="loser_shots" fill="#F44336" />
            </>
          ) : (
            <>
              <Bar dataKey="winner_goals" fill="#4CAF50" />
              <Bar dataKey="loser_goals" fill="#F44336" />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShotTypeStats;
