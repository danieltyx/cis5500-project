import React from 'react';

const matchTypes = ['R', 'P'];

const GamesFilter = ({
  filters,
  allTeams,
  homeSuggestions,
  awaySuggestions,
  handleFilterChange,
  toggleMatchType,
  filterSuggestions,
  setHomeSuggestions,
  setAwaySuggestions,
  handleSearch,
  clearFilter,
  currPage
}) => {
  return (
    <div className="filters">
      <div className="filter-box">
        <label><b>Season</b></label>
        <input
          value={filters.season}
          onChange={e => handleFilterChange('season', e.target.value)}
        />
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
              <div key={i} onClick={() => handleFilterChange('homeTeam', t)}>{t}</div>
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
              <div key={i} onClick={() => handleFilterChange('awayTeam', t)}>{t}</div>
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
        <button className="search-button" onClick={() => handleSearch(currPage)}>Search</button>
        <button className="search-button" onClick={clearFilter}>Clear Filter</button>
      </div>
    </div>
  );
};

export default GamesFilter;
