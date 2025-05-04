var config = require("./db-config.js");

const { Pool, types } = require("pg");
config.connectionLimit = 10;
const connection = new Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  database: config.database,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

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
          res.json(data.rows);
        }
      }
    );
  }
};

const getRecords = async (req, res) => {
  //query 4
  const team_id = req.query.team_id || -1;
  const season = req.query.season || -1;
  if (season != -1 && team_id == -1) {
    connection.query(
      `WITH relevant_games as (select * from games WHERE season=${season} 
     ) SELECT t.team_id,t.team_name,r.season,SUM(
CASE 
WHEN r.home_team_id = t.team_id AND r.home_goals > r.away_goals THEN 1
WHEN r.away_team_id = t.team_id AND r.away_goals > r.home_goals THEN 1
ELSE 0
END
) AS wins,SUM(
CASE 
WHEN r.home_team_id = t.team_id AND r.home_goals < r.away_goals THEN 1
WHEN r.away_team_id = t.team_id AND r.away_goals < r.home_goals THEN 1
ELSE 0
END
) AS losses,
SUM(
CASE 
WHEN r.home_team_id = t.team_id AND r.home_goals = r.away_goals THEN 1
WHEN r.away_team_id = t.team_id AND r.away_goals = r.home_goals THEN 1
ELSE 0
END
) AS ties 
FROM relevant_games r join teams t on t.team_id=r.home_team_id OR t.team_id=r.away_team_id
group by t.team_id,t.team_name,r.season 
order by wins desc;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows);
        }
      }
    );
  } else if (season != -1 && team_id != -1) {
    connection.query(
      `WITH relevant_games as (select * from games WHERE season=${season} AND home_team_id=${team_id} OR away_team_id=${team_id}
     ) SELECT t.team_id,t.team_name,r.season, SUM(
CASE 
WHEN r.home_team_id = t.team_id AND r.home_goals > r.away_goals THEN 1
WHEN r.away_team_id = t.team_id AND r.away_goals > r.home_goals THEN 1
ELSE 0
END
) AS wins,SUM(
CASE 
WHEN r.home_team_id = t.team_id AND r.home_goals < r.away_goals THEN 1
WHEN r.away_team_id = t.team_id AND r.away_goals < r.home_goals THEN 1
ELSE 0
END
) AS losses,
SUM(
CASE 
WHEN r.home_team_id = t.team_id AND r.home_goals = r.away_goals THEN 1
WHEN r.away_team_id = t.team_id AND r.away_goals = r.home_goals THEN 1
ELSE 0
END
) AS ties 
FROM relevant_games r join teams t on t.team_id=r.home_team_id OR t.team_id=r.away_team_id
group by t.team_id,t.team_name,r.season 
order by wins desc;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows[0]);
        }
      }
    );
  } else if (team_id == -1) {
    connection.query(
      `WITH relevant_games as (select * from games
  ) SELECT t.team_id,t.team_name,r.season, SUM(
  CASE 
  WHEN r.home_team_id = t.team_id AND r.home_goals > r.away_goals THEN 1
  WHEN r.away_team_id = t.team_id AND r.away_goals > r.home_goals THEN 1
  ELSE 0
  END
  ) AS wins,SUM(
  CASE 
  WHEN r.home_team_id = t.team_id AND r.home_goals < r.away_goals THEN 1
  WHEN r.away_team_id = t.team_id AND r.away_goals < r.home_goals THEN 1
  ELSE 0
  END
  ) AS losses,
  SUM(
  CASE 
  WHEN r.home_team_id = t.team_id AND r.home_goals = r.away_goals THEN 1
  WHEN r.away_team_id = t.team_id AND r.away_goals = r.home_goals THEN 1
  ELSE 0
  END
  ) AS ties 
  FROM relevant_games r join teams t on t.team_id=r.home_team_id OR t.team_id=r.away_team_id
  group by t.team_id,t.team_name,r.season 
  order by wins desc;`,
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
      `WITH relevant_games as (select * from games WHERE home_team_id=${team_id} OR away_team_id=${team_id}
  ) SELECT t.team_id,t.team_name,r.season, SUM(
  CASE 
  WHEN r.home_team_id = t.team_id AND r.home_goals > r.away_goals THEN 1
  WHEN r.away_team_id = t.team_id AND r.away_goals > r.home_goals THEN 1
  ELSE 0
  END
  ) AS wins,SUM(
  CASE 
  WHEN r.home_team_id = t.team_id AND r.home_goals < r.away_goals THEN 1
  WHEN r.away_team_id = t.team_id AND r.away_goals < r.home_goals THEN 1
  ELSE 0
  END
  ) AS losses,
  SUM(
  CASE 
  WHEN r.home_team_id = t.team_id AND r.home_goals = r.away_goals THEN 1
  WHEN r.away_team_id = t.team_id AND r.away_goals = r.home_goals THEN 1
  ELSE 0
  END
  ) AS ties 
  FROM relevant_games r join teams t on t.team_id=r.home_team_id OR t.team_id=r.away_team_id
  group by t.team_id,t.team_name,r.season 
  order by wins desc;`,
      (err, data) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          res.json(data.rows);
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
)
SELECT t.team_id, t.team_name, G.final_count, G.early_count, (G.final_count * 1.0 / G.early_count) AS final_to_early_ratio
FROM ge_summary g
JOIN teams t ON g.team_id_for = t.team_id
WHERE g.early_count > 0
ORDER BY final_to_early_ratio DESC;`,
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
SUM(CASE WHEN period < 3 THEN 1 ELSE 0 END) as early_count
    FROM game_events
    WHERE team_id_for=${team_id}
    GROUP BY team_id_for
)
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
  getRecords,
  finalToEarlyRatio,
};
