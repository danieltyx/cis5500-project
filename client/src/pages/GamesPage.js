import React, { useState, useEffect, useRef } from "react";
import GamesTable from "../components/GamesTable";
import GamesFilter from "../components/GamesFilter";
import GameShotTypes from "../components/GameShotTypes";
import LopsidedGames from "../components/LopsidedGames";
import ExperiencedWinnerLocations from "../components/ExperiencedWinnerLocations";
import AggressiveEvents from "../components/AggressiveEvents";
import "../style/GamesPage.css";
import config from "../config";

const TABS = [
  "Find Games",
  "Shot Analysis",
  "Lopsided Games",
  "Experienced Winner Locations",
  "Aggressive Events",
];

function GamesPage() {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [filters, setFilters] = useState({
    season: "",
    type: ["R", "P"],
    homeTeam: "",
    awayTeam: "",
    dateRangeStart: "",
    dateRangeEnd: "",
  });

  // Handle all filters and retrieved data. All of this is for the GamesFilter/GamesTable
  const [allTeams, setAllTeams] = useState([]);
  const [homeSuggestions, setHomeSuggestions] = useState([]);
  const [awaySuggestions, setAwaySuggestions] = useState([]);
  const [currGames, setCurrGames] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMatchType = (type) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const filterSuggestions = (input, source) =>
    source.filter((option) =>
      option.toLowerCase().includes(input.toLowerCase())
    );

  const handleSearch = (page) => {
    if (filters.type.length === 0) {
      alert("Please select a type of match.");
    } else {
      const queryParams = new URLSearchParams(filters);

      setCurrPage(page);
      fetch(`${config.host}/find_games?page=${page}&${queryParams.toString()}`)
        .then((res) => res.json())
        .then((games) => {
          setCurrGames(games);
        })
        .catch((err) => console.error("Error fetching games:", err));
    }
  };

  const clearFilter = () => {
    setFilters({
      season: "",
      type: ["R", "P"],
      homeTeam: "",
      awayTeam: "",
      dateRangeStart: "",
      dateRangeEnd: "",
    });
  };

  const justLoadedRef = useRef(true);

  useEffect(() => {
    // Loads the data once on load
    if (justLoadedRef.current) {
      handleSearch(1);
      justLoadedRef.current = false;
    }

    // Fetch all teams for autofill on load
    fetch(`${config.host}/teams`)
      .then((res) => res.json())
      .then((teams) => {
        const teamNames = teams.map((team) => team.team_name);
        setAllTeams(teamNames);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  return (
    <div className="games-page">
      {/* Handle the 5 types of game pages for the user to switch between */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${selectedTab === tab ? "active" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Get GamesFilter component and GamesTable component to display all games */}
      {selectedTab === 'Find Games' && (
        <div className="content">
          <GamesFilter
            filters={filters}
            allTeams={allTeams}
            homeSuggestions={homeSuggestions}
            awaySuggestions={awaySuggestions}
            handleFilterChange={handleFilterChange}
            toggleMatchType={toggleMatchType}
            filterSuggestions={filterSuggestions}
            setHomeSuggestions={setHomeSuggestions}
            setAwaySuggestions={setAwaySuggestions}
            handleSearch={handleSearch}
            clearFilter={clearFilter}
            currPage={currPage}
          />

          <div className="table-container">
            <GamesTable games={currGames} />
            <div
              className="pagination-controls"
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => handleSearch(Math.max(currPage - 1, 1))}
                disabled={currPage === 1}
              >
                Previous
              </button>
              <span>Page {currPage}</span>
              <button
                onClick={() => handleSearch(currPage + 1)}
                disabled={currGames.length < 15}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTab === 'Shot Analysis' && (
        <div>
          <GameShotTypes />
        </div>
      )}
      {selectedTab === 'Lopsided Games' && (
        <div>
          <LopsidedGames />
        </div>
      )}
      {selectedTab === 'Experienced Winner Locations' && (
        <div>
          <ExperiencedWinnerLocations />
        </div>
      )}
      {selectedTab === 'Aggressive Events' && (
        <div>
          <AggressiveEvents />
        </div>
      )}
    </div>
  );
}

export default GamesPage;
