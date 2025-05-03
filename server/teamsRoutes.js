var config = require("./db-config.js");
var mysql = require("mysql");

config.connectionLimit = 10;
var connection = mysql.createPool(config);
//query 1

const getTeams = async (req, res) => {
  connection.query(`SELECT team_id, team_name from teams;`, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
};
const offense_x = async (req, res) => {
  const team_id = req.query.team_id || -1;
  if (team_id == -1) {
    //all teams
    connection.query(
      `SELECT ge.team_id_for AS team_id, t.team_name, AVG(ge.x) AS avg_x_coordinate
        FROM game_events ge
        JOIN teams t ON ge.team_id_for = t.team_id
        GROUP BY ge.team_id_for, t.team_name;
  `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows);
        }
      }
    );
  } else {
    connection.query(
      //just one team
      `SELECT ge.team_id_for AS team_id, t.team_name, AVG(ge.x) AS avg_x_coordinate
        FROM game_events ge
        JOIN teams t ON ge.team_id_for = t.team_id
        WHERE ge.team_id_for=${team_id}
        GROUP BY ge.team_id_for, t.team_name;
    `,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows[0]);
        }
      }
    );
  }
};

const total_goals = async (req, res) => {
  //query 2
  const team_id = req.query.team_id || -1;
  if (team_id == -1) {
    connection.query(
      `SELECT t.team_id, t.team_name, SUM(g.goals) AS total_goals
        FROM (
            SELECT home_team_id AS team_id, home_goals AS goals
            FROM games
            UNION ALL
            SELECT away_team_id AS team_id, away_goals AS goals
            FROM games
        ) g
        JOIN teams t ON g.team_id = t.team_id
        GROUP BY t.team_id, t.team_name;
`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows);
        }
      }
    );
  } else {
    connection.query(
      `SELECT t.team_id, t.team_name, SUM(g.goals) AS total_goals
        FROM (
            SELECT home_team_id AS team_id, home_goals AS goals
            FROM games
            UNION ALL
            SELECT away_team_id AS team_id, away_goals AS goals
            FROM games
        ) g
        JOIN teams t ON g.team_id = t.team_id
        WHERE t.team_id=${team_id}
        GROUP BY t.team_id, t.team_name;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows[0]);
        }
      }
    );
  }
};

const avg_goals = async (req, res) => {
  //query 3
  const team_id = req.query.team_id || -1;
  if (team_id == -1) {
    connection.query(
      `SELECT season, AVG(home_goals + away_goals) AS avg_goals_per_game
        FROM games
        GROUP BY season;

`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows);
        }
      }
    );
  } else {
    connection.query(
      `SELECT season, AVG(home_goals + away_goals) AS avg_goals_per_game
FROM games 
WHERE home_team_id=${team_id} OR away_team_id=${team_id}
GROUP BY season;
`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows[0]);
        }
      }
    );
  }
};

const finalToEarlyRatio = async (req, res) => {
  //query 7
  const team_id = req.query.team_id || -1;
  if (team_id == -1) {
    connection.query(
      `WITH ge_summary AS (
        SELECT 
        team_id_for,
        SUM(CASE WHEN period = 3 THEN 1 ELSE 0 END) AS final_count,
        SUM(CASE WHEN period < 3 THEN 1 ELSE 0 END) AS early_count
            FROM game_events
            GROUP BY team_id_for
        ),
        SELECT t.team_id, t.team_name, G.final_count, G.early_count, (G.final_count * 1.0 / G.early_count) AS final_to_early_ratio
        FROM ge_summary G
        JOIN teams t ON G.team_id_for = t.team_id
        WHERE G.early_count > 0
        ORDER BY final_to_early_ratio DESC;
`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows);
        }
      }
    );
  } else {
    connection.query(
      `WITH ge_summary AS (
        SELECT 
        team_id_for,
        SUM(CASE WHEN period = 3 THEN 1 ELSE 0 END) AS final_count,
        SUM(CASE WHEN period < 3 THEN 1 ELSE 0 END) AS early_count
            FROM game_events
            WHERE team_id_for=${team_id}
            GROUP BY team_id_for
        ),
        SELECT t.team_id, t.team_name, G.final_count, G.early_count, (G.final_count * 1.0 / G.early_count) AS final_to_early_ratio
        FROM ge_summary G
        JOIN teams t ON G.team_id_for = t.team_id
        WHERE G.early_count > 0
        ORDER BY final_to_early_ratio DESC;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows[0]);
        }
      }
    );
  }
};

module.exports = {
  getTeams,
  offense_x,
  total_goals,
  avg_goals,
  finalToEarlyRatio,
};
