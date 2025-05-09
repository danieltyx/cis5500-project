import React, { useState, useEffect } from "react";
import "../style/TeamsPage.css";
import config from "../config";
// import { paste } from "@testing-library/user-event/dist/paste";

function TeamsPage() {
  const TABS = [
    "Get Teams",
    "Average Offense X Position",
    "Total Goals",
    "Average Goals",
    "Team Records", //tabs on the page
    "Final to Early Ratio",
  ];
  const teamOkTabs = [TABS[1], TABS[2], TABS[3], TABS[4], TABS[5]];
  const seasonOkTabs = [TABS[4]];
  const [selectedTab, setSelectedTab] = useState("Get Teams");
  const [pageData, setPageData] = useState([]);
  const [teamID, setTeamID] = useState(1);
  const [teams, setTeams] = useState([]);
  const [teamFilter, setTeamFilter] = useState(false);
  const [seasonFilter, setSeasonFilter] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("20002001");
  const [error, setError] = useState(null);

  const generateSeasons = () => {
    const seasons = [];
    for (let year = 2000; year <= 2019; year++) {
      if (year !== 2004) {
        seasons.push(`${year}${year + 1}`);
      }
    }
    return seasons;
  };

  const seasons = generateSeasons();
  //below is all of our funcs for api handling
  async function getTeamsData() {
    try {
      console.log(
        "Fetching from:",
        `${config.host}/teams${teamFilter ? "?team_id=" + teamID : ""}`
      );
      const response = await fetch(
        `${config.host}/teams${teamFilter ? "?team_id=" + teamID : ""}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parsedData = await response.json();
      console.log("Received data:", parsedData);

      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
        return [parsedData]; //sometiems with filters it just returns a single obj (i.e. record of a team in a given szn)
      } else {
        setPageData(parsedData);
        return parsedData;
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError(err.message);
      alert(error);
      return [];
    }
  }

  async function getAvgOffenseX() {
    try {
      const data = await fetch(
        `${config.host}/teams/offense-x${
          teamFilter ? "?team_id=" + teamID : ""
        }`
      );
      const parsedData = await data.json();
      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
      } else {
        setPageData(parsedData);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getTotalGoals() {
    try {
      const data = await fetch(
        `${config.host}/teams/total-goals${
          teamFilter ? "?team_id=" + teamID : ""
        }`
      );
      const parsedData = await data.json();
      console.log(parsedData);
      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
      } else {
        setPageData(parsedData);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getAvgGoals() {
    try {
      const data = await fetch(
        `${config.host}/teams/avg-goals${
          teamFilter ? "?team_id=" + teamID : ""
        }`
      );
      const parsedData = await data.json();
      console.log(parsedData);
      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
      } else {
        setPageData(parsedData);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getRecords() {
    try {
      let fetchUrl = `${config.host}/teams/records${
        teamFilter ? "?team_id=" + teamID : ""
      }`;
      if (seasonFilter && teamFilter) {
        fetchUrl += `&season=${selectedSeason}`;
      } else if (seasonFilter) {
        fetchUrl += `?season=${selectedSeason}`;
      }
      const data = await fetch(fetchUrl);
      const parsedData = await data.json();
      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
      } else {
        setPageData(parsedData);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getFinalToEarlyRatio() {
    try {
      const data = await fetch(
        `${config.host}/teams/final-to-early-ratio${
          teamFilter ? "?team_id=" + teamID : ""
        }`
      );
      const parsedData = await data.json();
      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
      } else {
        setPageData(parsedData);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    const handleData = async () => {
      try {
        console.log(selectedTab);
        if (selectedTab === "Get Teams") {
          await getTeamsData();
        } else if (selectedTab === "Average Offense X Position") {
          await getAvgOffenseX();
        } else if (selectedTab === "Total Goals") {
          await getTotalGoals();
        } else if (selectedTab === "Average Goals") {
          await getAvgGoals();
        } else if (selectedTab === "Team Records") {
          await getRecords();
        } else {
          await getFinalToEarlyRatio();
        }
      } catch (err) {
        console.log(err);
      }
    };
    handleData();
  }, [selectedTab, teamID, teamFilter, seasonFilter, selectedSeason]);

  useEffect(() => {
    const handleData = async () => {
      const data = await getTeamsData();
      setTeams(data);
    };
    handleData();
  }, []);
  return (
    <div className="Teams">
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            className={`tabButton ${selectedTab === tab ? "selected" : ""}`}
            key={tab}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="thefilters">
        <div className="filter-controls">
          {teamOkTabs.includes(selectedTab) && ( //some tabs don't need the team filtering
            <label>
              Team Filter:
              <input
                type="checkbox"
                checked={teamFilter}
                onChange={() => setTeamFilter(!teamFilter)}
              />
            </label>
          )}
          {seasonOkTabs.includes(selectedTab) && ( //some tabs don't need the season filtering
            <label>
              Season Filter:
              <input
                type="checkbox"
                checked={seasonFilter}
                onChange={() => setSeasonFilter(!seasonFilter)}
              />
            </label>
          )}
          {teamFilter &&
            teamOkTabs.includes(selectedTab) && ( //some tabs don't need the team filtering
              <select
                value={teamID}
                onChange={(e) => setTeamID(e.target.value)}
              >
                {teams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            )}
          {seasonFilter && seasonOkTabs.includes(selectedTab) && (
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {pageData &&
        pageData.length > 0 && ( //made a general table component that j reuses the structure of the first element
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  {Object.keys(pageData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((item, index) => (
                  <tr key={index}>
                    {Object.keys(item).map((key) => (
                      <td key={key}>{item[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

export default TeamsPage;
