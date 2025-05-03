import React, { useState, useEffect } from 'react';
import GamesTable from '../components/GamesTable';
import '../style/GamesPage.css';
const config = require('../config.json');

const TABS = ['Find Games', 'Shot Analysis', 'Lopsided Games'];
const matchTypes = ['Regular', 'Playoffs'];

const allSeasons = ['2021', '2022', '2023'];
const allTeams = ['Philadelphia Flyers', 'Pittsburgh Penguins', 'Boston Bruins', 'NY Rangers'];

function GamesPage() {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [filters, setFilters] = useState({
    season: '',
    type: ['Regular', 'Playoffs'],
    homeTeam: '',
    awayTeam: '',
    dateRangeStart: '',
    dateRangeEnd: '',
  });

  const [seasonSuggestions, setSeasonSuggestions] = useState([]);
  const [homeSuggestions, setHomeSuggestions] = useState([]);
  const [awaySuggestions, setAwaySuggestions] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

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

  const handleSearch = () => {
    const filtered = allGames.filter(game => {
      return (
        (filters.season === '' || game.season === filters.season) &&
        (filters.type.includes(game.type)) &&
        (filters.homeTeam === '' || game.homeTeam.toLowerCase().includes(filters.homeTeam.toLowerCase())) &&
        (filters.awayTeam === '' || game.awayTeam.toLowerCase().includes(filters.awayTeam.toLowerCase())) &&
        (!filters.dateRangeStart || new Date(game.date) >= new Date(filters.dateRangeStart)) &&
        (!filters.dateRangeEnd || new Date(game.date) <= new Date(filters.dateRangeEnd))
      );
    });
    setFilteredGames(filtered);
  };
  

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/games`)
      .then(res => res.json())
      .then(games => {
        console.log(games[0]);
        setAllGames(games);
        setFilteredGames(games);
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
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <div className="table-container">
            <GamesTable games={filteredGames}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamesPage;
