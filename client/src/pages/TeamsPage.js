import React, { useState, useEffect } from "react";
import "../style/TeamsPage.css";
// import { paste } from "@testing-library/user-event/dist/paste";
const config = {
  host: "http://localhost",
  port: 8080,
};
function TeamsPage() {
  const TABS = [
    "Get Teams",
    "Average Offense X Position",
    "Total Goals",
    "Average Goals",
    "Team Records",
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
  async function getTeamsData() {
    try {
      const data = await fetch(
        `${config.host}:${config.port}/teams${
          teamFilter ? "?team_id=" + teamID : ""
        }`
      );
      const parsedData = await data.json();
      if (!Array.isArray(parsedData)) {
        setPageData([parsedData]);
        return [parsedData];
      } else {
        setPageData(parsedData);
        return parsedData;
      }
    } catch (err) {
      console.log(err);
    }
  } //TODO: write all the function gets for api shit, make the pretty table, and add a useEffect for the tab shit
  async function getAvgOffenseX() {
    try {
      const data = await fetch(
        `${config.host}:${config.port}/teams/offense-x${
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
        `${config.host}:${config.port}/teams/total-goals${
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
  async function getAvgGoals() {
    try {
      const data = await fetch(
        `${config.host}:${config.port}/teams/avg-goals${
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
  async function getRecords() {
    try {
      let fetchUrl = `${config.host}:${config.port}/teams/records${
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
        `${config.host}:${config.port}/teams/final-to-early-ratio${
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
      <div className="pageHeader">
        {TABS.map((tab) => (
          <button
            className={`tabButton${selectedTab === tab ? "selected" : ""}`}
            key={tab}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="filters">
        {teamOkTabs.includes(selectedTab) && (
          <label>
            <input
              type="checkbox"
              checked={teamFilter}
              onChange={(e) => setTeamFilter(e.target.checked)}
            />
            Team Filter
          </label>
        )}

        {teamOkTabs.includes(selectedTab) && teamFilter && (
          <select
            value={teamID}
            onChange={(e) => {
              setTeamID(Number(e.target.value));
              console.log("Team ID" + teamID);
            }}
          >
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
        )}
        {seasonOkTabs.includes(selectedTab) && (
          <label>
            <input
              type="checkbox"
              checked={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.checked)}
            />
            Season Filter
          </label>
        )}
        {seasonOkTabs.includes(selectedTab) && seasonFilter && (
          <select
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(e.target.value);
            }}
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season.slice(0, 4)}-{season.slice(4, 8)}
              </option>
            ))}
          </select>
        )}
      </div>
      {pageData && pageData.length > 0 && (
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
      )}
    </div>
  );
}

export default TeamsPage;
