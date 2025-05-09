const { Pool, types } = require("pg");
var config = require("./db-config.js");

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

const get_players = async (req, res) => {
  connection.query(
    `SELECT player_id, first_name, last_name, nationality, birth_city, primary_position, birth_date, height_cm FROM players;`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

const searchPlayers = async (req, res) => {
  let baseQuery = `
    SELECT player_id, first_name, last_name, nationality, birth_city, primary_position, birth_date, height_cm
    FROM players
    WHERE 1=1`;
  const conditions = [];

  if (req.query.player_id) {
    conditions.push(`CAST(player_id AS TEXT) LIKE '%${req.query.player_id}%'`);
  }
  if (req.query.name) {
    conditions.push(`(first_name ILIKE '%${req.query.name}%' OR last_name ILIKE '%${req.query.name}%')`);

  }
  if (req.query.name) {
    conditions.push(`(first_name ILIKE '%${req.query.name}%' OR last_name ILIKE '%${req.query.name}%')`);
  }
  if (req.query.position) {
    conditions.push(`primary_position ILIKE '%${req.query.position}%'`);
  }
  if (req.query.nationality) {
    conditions.push(`nationality ILIKE '%${req.query.nationality}%'`);
  }
  if (req.query.birth_city) {
    conditions.push(`birth_city ILIKE '%${req.query.birth_city}%'`);
  }

  if (conditions.length > 0) {
    baseQuery += " AND " + conditions.join(" AND ");
  }

  console.log(baseQuery);
  connection.query(baseQuery, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
};

// query 5 (changed from milestone)
const getNationalitySummary = async (req, res) => {
  const { nationality, limit = 10, offset = 0 } = req.query;

  const values = [];
  let query = `
    WITH player_positions AS (
      SELECT p.player_id, p.first_name, p.last_name, p.primary_position, pt.season
      FROM players p
      JOIN player_teams pt ON p.player_id = pt.player_id
      ${nationality ? "WHERE p.nationality = $1" : ""}
    ),
    position_counts AS (
      SELECT player_id, first_name, last_name, primary_position,
             COUNT(DISTINCT season) AS seasons_played
      FROM player_positions
      GROUP BY player_id, first_name, last_name, primary_position
    )
    SELECT *
    FROM position_counts
    ORDER BY seasons_played DESC
    LIMIT $${nationality ? 2 : 1} OFFSET $${nationality ? 3 : 2}
  `;

  if (nationality) {
    values.push(nationality, limit, offset);
  } else {
    values.push(limit, offset);
  }

  connection.query(query, values, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Query failed" });
    } else {
      res.json(data.rows);
    }
  });
};

// Team Routes
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
  //qurry 2
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

// Game Routes
const getGames = async (req, res) => {
  // Query 6: gets all games given the specific query parameters. Handles cases if the parameters are empty
  const season = req.query.season ? parseInt(req.query.season) : null;
  let seasonCondition = "";
  if (season) {
    seasonCondition = `\nAND (
      season = ${"" + (season - 1) + season} OR 
      season = ${"" + season + (season + 1)}
    )`;
  }
  var type = req.query.type ? req.query.type.split(",") : [];
  type = type.map((type) => "'" + type + "'");
  const homeTeam = req.query.homeTeam || "";
  const awayTeam = req.query.awayTeam || "";
  const dateRangeStart = req.query.dateRangeStart || null;
  const dateRangeEnd = req.query.dateRangeEnd || null;
  const dateConditions = [];
  if (dateRangeStart)
    dateConditions.push(`G.date_time_gmt >= '${dateRangeStart}T00:00:00Z'`);
  if (dateRangeEnd)
    dateConditions.push(`G.date_time_gmt <= '${dateRangeEnd}T00:00:00Z'`);
  const dateCondition = dateConditions.length
    ? `\nAND ${dateConditions.join(" AND ")}`
    : "";
  const page = parseInt(req.query.page || "1", 10);
  const pageSize = 15;
  const offset = (page - 1) * pageSize;

  connection.query(
    `SELECT game_id, season, enum, T1.team_name AS home_team_name, T2.team_name AS away_team_name, away_goals, home_goals, date_time_gmt
  FROM games G
  INNER JOIN teams T1 ON T1.team_id = G.home_team_id
  INNER JOIN teams T2 ON T2.team_id = G.away_team_id 
  WHERE G.enum IN (${String(type)})
    AND T1.team_name LIKE '%${homeTeam}%'
    AND T2.team_name LIKE '%${awayTeam}%'${seasonCondition}${dateCondition}
  ORDER BY date_time_gmt
  LIMIT ${pageSize}
  OFFSET ${offset};`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data.rows);
      }
    }
  );
};

const getShotTypeStats = (req, res) => {
  // Query 8: get all game events that are shots and goals, then group them by secondaryType to display in table/chart form
  connection.query(`
    SELECT 
        ge.secondaryType AS shot_type,
        SUM(CASE 
          WHEN ge.event = 'Shot' AND 
            ((g.home_goals > g.away_goals AND ge.team_id_for = g.home_team_id) OR 
              (g.away_goals > g.home_goals AND ge.team_id_for = g.away_team_id))
          THEN 1 ELSE 0 END) AS winner_shots,
        SUM(CASE 
          WHEN ge.event = 'Goal' AND 
            ((g.home_goals > g.away_goals AND ge.team_id_for = g.home_team_id) OR 
              (g.away_goals > g.home_goals AND ge.team_id_for = g.away_team_id))
          THEN 1 ELSE 0 END) AS winner_goals,
        SUM(CASE 
          WHEN ge.event = 'Shot' AND 
              ((g.home_goals < g.away_goals AND ge.team_id_for = g.home_team_id) OR 
                (g.away_goals < g.home_goals AND ge.team_id_for = g.away_team_id))
          THEN 1 ELSE 0 END) AS loser_shots,
        SUM(CASE 
          WHEN ge.event = 'Goal' AND 
                ((g.home_goals < g.away_goals AND ge.team_id_for = g.home_team_id) OR 
                (g.away_goals < g.home_goals AND ge.team_id_for = g.away_team_id))
          THEN 1 ELSE 0 END) AS loser_goals
    FROM game_events ge
    JOIN games g ON ge.game_id = g.game_id
    WHERE (ge.event = 'Shot' OR ge.event = 'Goal')
      AND ge.secondaryType IS NOT NULL
      AND ge.secondaryType != 'NA'
    GROUP BY ge.secondaryType;
`,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Query failed" });
      } else {
        res.json(results);
      }
    }
  );
};

const getLopsidedGames = (req, res) => {
  // query 10
  connection.query(`
    WITH goal_diffs AS (
      SELECT 
        g.*, 
        ABS(g.home_goals - g.away_goals) AS goal_diff,
        t1.team_name AS home_team_name,
        t2.team_name AS away_team_name
      FROM games g
      INNER JOIN teams t1 ON t1.team_id = g.home_team_id
      INNER JOIN teams t2 ON t2.team_id = g.away_team_id
    ),
    max_diff AS (
      SELECT MAX(goal_diff) / 2.0 AS max_diff FROM goal_diffs
    ),
    shots AS (
      SELECT 
        ge.game_id,
        SUM(CASE WHEN ge.team_id_for = g.home_team_id THEN 1 ELSE 0 END) AS home_shots,
        SUM(CASE WHEN ge.team_id_for = g.away_team_id THEN 1 ELSE 0 END) AS away_shots
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      WHERE ge.event = 'Shot'
      GROUP BY ge.game_id
    )
    SELECT 
      gd.game_id, gd.season, gd.home_team_name, gd.away_team_name, gd.home_goals, gd.away_goals, gd.goal_diff, s.home_shots, s.away_shots
    FROM goal_diffs gd
    JOIN shots s ON gd.game_id = s.game_id
    WHERE gd.goal_diff >= (SELECT max_diff FROM max_diff)
    ORDER BY gd.goal_diff DESC;
`,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Query failed" });
      } else {
        res.json(results);
      }
    }
  );
};

const getAvgXYExperiencedWinner = (req, res) => {
  connection.query(`
    WITH player_season_counts AS (
      SELECT player_id
      FROM player_teams
      GROUP BY player_id
      HAVING COUNT(DISTINCT season) >= 8
    ),
    filtered_events AS (
      SELECT
        ge.event,
        ge.x,
        ge.y,
        ge.game_id,
        ge.team_id_for,
        g.season
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      JOIN player_teams pt ON pt.season = g.season
      JOIN player_season_counts psc ON pt.player_id = psc.player_id
    ),
    team_wins AS (
      SELECT
        season,
        CASE
          WHEN home_goals > away_goals THEN home_team_id
          WHEN away_goals > home_goals THEN away_team_id
        END AS winning_team
      FROM games
    ),
    season_top_teams AS (
      SELECT season, winning_team
      FROM (
        SELECT
          season,
          winning_team,
          COUNT(*) AS wins,
          RANK() OVER (PARTITION BY season ORDER BY COUNT(*) DESC) AS rank
        FROM team_wins
        WHERE winning_team IS NOT NULL
        GROUP BY season, winning_team
      ) ranked
      WHERE rank = 1
    )
    SELECT
      fe.event,
      AVG(fe.x) AS avg_x,
      AVG(fe.y) AS avg_y,
      COUNT(*) AS total_events,
      MAX(g.date_time_GMT) AS latest_game_time
    FROM filtered_events fe
    JOIN season_top_teams stt
      ON stt.season = fe.season AND stt.winning_team = fe.team_id_for
    JOIN games g ON fe.game_id = g.game_id
    GROUP BY fe.event
    ORDER BY avg_x DESC;
`,
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Query failed" });
      } else {
        res.json(results);
      }
    }
  );
};

const getAggravatedStats = (req, res) => {
  connection.query(
    `SELECT
    f.game_id,
    f.period,
    COUNT(*) AS aggravated_events,
    g.goal_count,
    ROUND(g.avg_goal_x, 2) AS avg_goal_x,
    ROUND(g.avg_goal_y, 2) AS avg_goal_y,
    ROUND(AVG(ABS(f.fight_x - g.avg_goal_x)), 2) AS avg_abs_x_dist,
    ROUND(AVG(ABS(f.fight_y - g.avg_goal_y)), 2) AS avg_abs_y_dist,
    ROUND(agg.total_goals, 2) AS total_goals,
    ROUND(agg.total_shots, 2) AS total_shots,
    ROUND(agg.total_goals - avg_stats.avg_goals_per_game, 2) AS normalized_goals,
    ROUND(agg.total_shots - avg_stats.avg_shots_per_game, 2) AS normalized_shots
FROM fight_events f
JOIN goal_stats g
  ON f.game_id = g.game_id AND f.period = g.period
JOIN game_aggregates agg
  ON f.game_id = agg.game_id
CROSS JOIN game_averages avg_stats
GROUP BY
    f.game_id, f.period, g.goal_count, g.avg_goal_x, g.avg_goal_y,
    agg.total_goals, agg.total_shots, avg_stats.avg_goals_per_game, avg_stats.avg_shots_per_game;`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data.rows);
      }
    }
  );
};

module.exports = {
  get_players,
  searchPlayers,
  getNationalitySummary,
  getTeams,
  offense_x,
  total_goals,
  avg_goals,
  getRecords,
  finalToEarlyRatio,
  getGames,
  getShotTypeStats,
  getLopsidedGames,
  getAvgXYExperiencedWinner,
  getAggravatedStats,
};
