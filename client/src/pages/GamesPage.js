import React, { useState, useEffect, useRef } from 'react';
import GamesTable from '../components/GamesTable';
import '../style/GamesPage.css';
const config = require('../config.json');

const TABS = ['Find Games', 'Shot Analysis', 'Lopsided Games'];
const matchTypes = ['R', 'P'];
const justLoaded = true;

function GamesPage() {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [filters, setFilters] = useState({
    season: '',
    type: ['R', 'P'],
    homeTeam: '',
    awayTeam: '',
    dateRangeStart: '',
    dateRangeEnd: ''
  });

  const [allSeasons, setAllSeasons] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [seasonSuggestions, setSeasonSuggestions] = useState([]);
  const [homeSuggestions, setHomeSuggestions] = useState([]);
  const [awaySuggestions, setAwaySuggestions] = useState([]);
  const [currGames, setCurrGames] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const toggleMatchType = (type) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type],
    }));
  };

  const filterSuggestions = (input, source) =>
    source.filter(option => option.toLowerCase().includes(input.toLowerCase()));

  const handleSearch = (page) => {
    if (filters.type.length === 0) {
      alert("Please select a type of match.");
    } else {
      const queryParams = new URLSearchParams(filters);

      setCurrPage(page);
      fetch(`http://${config.server_host}:${config.server_port}/find_games?page=${page}&${queryParams.toString()}`)
        .then(res => res.json())
        .then(games => {
          setCurrGames(games);
      });
    }
  }

  const clearFilter = () => {
    setFilters({
      season: '',
      type: ['R', 'P'],
      homeTeam: '',
      awayTeam: '',
      dateRangeStart: '',
      dateRangeEnd: ''
    });
  }

  const justLoadedRef = useRef(true);

  useEffect(() => {
    if (justLoadedRef.current) {
      handleSearch(1);
      justLoadedRef.current = false;
    }

    fetch(`http://${config.server_host}:${config.server_port}/teams`)
      .then(res => res.json())
      .then(teams => {
        const teamNames = teams.map(team => team.team_name);
        setAllTeams(teamNames);
      });

    fetch(`http://${config.server_host}:${config.server_port}/seasons`)
      .then(res => res.json())
      .then(seasons => {
        setAllSeasons(seasons);
      });
  }, []);

  return (
    <div className="games-page">
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-button ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === 'Find Games' && (
        <div className="content">
          <div className="filters">
            <div className="filter-box">
              <label><b>Season</b></label>
              <input
                value={filters.season}
                onChange={e => {
                  handleFilterChange('season', e.target.value);
                  setSeasonSuggestions(filterSuggestions(e.target.value, allSeasons));
                }}
                onBlur={() => setTimeout(() => setSeasonSuggestions([]), 150)}
              />
              {seasonSuggestions.length > 0 && (
                <div className="suggestions">
                  {seasonSuggestions.map((s, i) => (
                    <div key={i} onClick={() => handleFilterChange('season', s)}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-box">
              <label><b>Home Team</b></label>
              <input
                value={filters.homeTeam}
                onChange={e => {
                  handleFilterChange('homeTeam', e.target.value);
                  setHomeSuggestions(filterSuggestions(e.target.value, allTeams));
                }}
                onBlur={() => setTimeout(() => setHomeSuggestions([]), 150)}
              />
              {homeSuggestions.length > 0 && (
                <div className="suggestions">
                  {homeSuggestions.map((t, i) => (
                    <div key={i} onClick={() => handleFilterChange('homeTeam', t)}>
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-box">
              <label><b>Away Team</b></label>
              <input
                value={filters.awayTeam}
                onChange={e => {
                  handleFilterChange('awayTeam', e.target.value);
                  setAwaySuggestions(filterSuggestions(e.target.value, allTeams));
                }}
                onBlur={() => setTimeout(() => setAwaySuggestions([]), 150)}
              />
              {awaySuggestions.length > 0 && (
                <div className="suggestions">
                  {awaySuggestions.map((t, i) => (
                    <div key={i} onClick={() => handleFilterChange('awayTeam', t)}>
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-box">
              <label><b>Match Type</b></label>
              {matchTypes.map(type => (
                <div key={type} className="checkbox-line">
                  <div className='checkbox-size'>
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => toggleMatchType(type)}
                    />
                  </div>
                  <span>{type}</span>
                </div>
              ))}
            </div>

            <div className="filter-box">
              <label><b>Date Range Start</b></label>
              <input
                type="date"
                value={filters.dateRangeStart}
                onChange={e => handleFilterChange('dateRangeStart', e.target.value)}
              />
            </div>

            <div className="filter-box">
              <label><b>Date Range End</b></label>
              <input
                type="date"
                value={filters.dateRangeEnd}
                onChange={e => handleFilterChange('dateRangeEnd', e.target.value)}
              />
            </div>

            <div className="filter-box">
              <button className="search-button" onClick={() => handleSearch(currPage)}>
                Search
              </button>
              <button className="search-button" onClick={() => clearFilter()}>
                Clear Filter
              </button>
            </div>
          </div>

          <div className="table-container">
            <GamesTable games={currGames}/>
            <div className="pagination-controls" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => handleSearch(Math.max(currPage - 1, 1))}
                disabled={currPage === 1}
              >
                Previous
              </button>
              <span>Page {currPage}</span>
              <button
                onClick={() => handleSearch(currPage + 1)}
                disabled={currGames.length < 15} // disable if fewer than 20 games returned
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamesPage;
