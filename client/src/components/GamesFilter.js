import React from "react";

const matchTypes = ["R", "P"];

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
  currPage,
}) => {
  return (
    // Code for the filtering (handles querying based on teams, season, page, etc)
    <div className="filters">
      {/* Section for season filter box */}
      <div className="filter-box">
        <label>
          <b>Season</b>
        </label>
        <input
          value={filters.season}
          onChange={(e) => handleFilterChange("season", e.target.value)}
        />
      </div>

      {/* Section for home team filter box */}
      <div className="filter-box">
        <label>
          <b>Home Team</b>
        </label>
        <input
          value={filters.homeTeam}
          onChange={(e) => {
            handleFilterChange("homeTeam", e.target.value);
            setHomeSuggestions(filterSuggestions(e.target.value, allTeams));
          }}
          onBlur={() => setTimeout(() => setHomeSuggestions([]), 150)}
        />
        {homeSuggestions.length > 0 && (
          <div className="suggestions">
            {homeSuggestions.map((t, i) => (
              <div key={i} onClick={() => handleFilterChange("homeTeam", t)}>
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section for away team filter box */}
      <div className="filter-box">
        <label>
          <b>Away Team</b>
        </label>
        <input
          value={filters.awayTeam}
          onChange={(e) => {
            handleFilterChange("awayTeam", e.target.value);
            setAwaySuggestions(filterSuggestions(e.target.value, allTeams));
          }}
          onBlur={() => setTimeout(() => setAwaySuggestions([]), 150)}
        />
        {awaySuggestions.length > 0 && (
          <div className="suggestions">
            {awaySuggestions.map((t, i) => (
              <div key={i} onClick={() => handleFilterChange("awayTeam", t)}>
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkboxes to determine if you want playoff games, regular games, or both */}
      <div className="filter-box">
        <label>
          <b>Match Type</b>
        </label>
        {matchTypes.map((type) => (
          <div key={type} className="checkbox-line">
            <div className="checkbox-size">
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

      {/* Date handling for finding matches that start on/after a specific date */}
      <div className="filter-box">
        <label>
          <b>Date Range Start</b>
        </label>
        <input
          type="date"
          value={filters.dateRangeStart}
          onChange={(e) => handleFilterChange("dateRangeStart", e.target.value)}
        />
      </div>

      {/* Date handling for finding matches that start on/before a specific date */}
      <div className="filter-box">
        <label>
          <b>Date Range End</b>
        </label>
        <input
          type="date"
          value={filters.dateRangeEnd}
          onChange={(e) => handleFilterChange("dateRangeEnd", e.target.value)}
        />
      </div>

      {/* Button to handle search based on the speciific page, buton to clear all filters */}
      <div className="filter-box">
        <button
          className="search-button"
          onClick={() => handleSearch(currPage)}
        >
          Search
        </button>
        <button className="search-button" onClick={clearFilter}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default GamesFilter;
