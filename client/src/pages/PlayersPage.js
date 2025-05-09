import { useEffect, useState } from "react";
import "../style/PlayersPage.css";
import config from "../config";

const TABS = ["Search Players", "Nationality & Position Summary"];

export default function PlayersPage() {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const [data, setData] = useState([]);
  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [heightRange, setHeightRange] = useState([160, 210]);

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 20;

  useEffect(() => {
    fetch(`${config.host}/players`) //get players route on default
      .then((res) => res.json())
      .then((resJson) => {
        const playersWithId = resJson.rows.map((p) => ({
          id: p.player_id,
          ...p,
        }));
        setData(playersWithId);
        setCurrentPage(1);
      })
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  const search = () => {
    const queryParams = new URLSearchParams({
      player_id: playerId,
      name,
      position,
      nationality,
      birth_city: birthCity,
      height_low: heightRange[0],
      height_high: heightRange[1],
    }); //filtering params

    fetch(`${config.host}/search_players?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((resJson) => {
        const playersWithId = resJson.rows.map((p) => ({
          id: p.player_id,
          ...p,
        }));
        setData(playersWithId);
        setCurrentPage(1);
      })
      .catch((err) => console.error("Error searching players:", err));
  };

  const totalPages = Math.ceil(data.length / resultsPerPage); //pagination handling
  const paginatedData = data.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const [summaryNationality, setSummaryNationality] = useState("");
  const [summaryResults, setSummaryResults] = useState([]);
  const [summaryPage, setSummaryPage] = useState(0);
  const summaryPageSize = 10;

  const fetchSummary = () => {
    const queryParams = new URLSearchParams({
      nationality: summaryNationality,
      limit: summaryPageSize,
      offset: summaryPage * summaryPageSize,
    });

    fetch(`${config.host}/nationality_summary?${queryParams}`)
      .then((res) => res.json())
      .then((data) => setSummaryResults(data))
      .catch((err) => console.error("Error fetching summary:", err));
  };

  useEffect(() => {
    if (selectedTab === "Nationality & Position Summary") {
      fetchSummary();
    }
  }, [selectedTab, summaryPage]);

  return (
    <div className="container">
      <div className="tabs">
        {TABS.map(
          (
            tab //handle page's navbar
          ) => (
            <button
              key={tab}
              className={`tab-button ${selectedTab === tab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {selectedTab === "Search Players" && (
        <div>
          <h2>Search Players</h2>
          <div className="form-grid">
            <input
              placeholder="Player ID"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
            />
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Position (ex: C, LW, RW, D, G)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <input
              placeholder="Nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
            <input
              placeholder="Birth City"
              value={birthCity}
              onChange={(e) => setBirthCity(e.target.value)}
            />
            <div className="height-search-row">
              <label>Height Range (cm):</label>
              <input
                type="number"
                min="140"
                max="220"
                value={heightRange[0]}
                onChange={(e) =>
                  setHeightRange([parseInt(e.target.value), heightRange[1]])
                }
                placeholder="Min Height"
                style={{ width: "100px", marginRight: "10px" }}
              />
              <input
                type="number"
                min="140"
                max="220"
                value={heightRange[1]}
                onChange={(e) =>
                  setHeightRange([heightRange[0], parseInt(e.target.value)])
                }
                placeholder="Max Height"
                style={{ width: "100px" }}
              />
              <button onClick={search} className="search-button">
                Search
              </button>
            </div>
          </div>
          <h2>Results</h2>
          <table className="player-table">
            <thead>
              <tr>
                <th>Player ID</th>
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
              {paginatedData.map(
                (
                  player //render row per player in the data from api
                ) => (
                  <tr key={player.player_id}>
                    <td>{player.player_id}</td>
                    <td>{player.first_name}</td>
                    <td>{player.last_name}</td>
                    <td>{player.primary_position}</td>
                    <td>{player.nationality}</td>
                    <td>{player.birth_city}</td>
                    <td>{new Date(player.birth_date).toLocaleDateString()}</td>
                    <td>{player.height_cm}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedTab === "Nationality & Position Summary" && ( //summarize based on nationality
        <div>
          <h2>Nationality Summary: Most Common Position & Seasons Played</h2>
          <input
            placeholder="Enter nationality (e.g., USA, CAN, ...)"
            value={summaryNationality}
            onChange={(e) => {
              setSummaryNationality(e.target.value);
              setSummaryPage(0);
            }}
            style={{ marginRight: "10px", width: "400px" }}
          />
          <button onClick={fetchSummary} className="search-button">
            Search
          </button>

          <table className="player-table" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Player ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Seasons Played</th>
              </tr>
            </thead>
            <tbody>
              {summaryResults.map((row) => (
                <tr key={row.player_id}>
                  <td>{row.player_id}</td>
                  <td>
                    {row.first_name} {row.last_name}
                  </td>
                  <td>{row.primary_position}</td>
                  <td>{row.seasons_played}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setSummaryPage((prev) => Math.max(prev - 1, 0))}
              disabled={summaryPage === 0}
            >
              Prev
            </button>
            <span>Page {summaryPage + 1}</span>
            <button
              onClick={() => setSummaryPage((prev) => prev + 1)}
              disabled={summaryResults.length < summaryPageSize}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
