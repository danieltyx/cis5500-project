const { Pool, types } = require('pg');
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
// game_id, season, enum, date_time_gmt, away_goals, home_goals, outcome, t1.team_name, t2.team_name

const getGames = async (req, res) => {
  const season = req.query.season ? parseInt(req.query.season) : null;
  let seasonCondition = '';
  if (season) {
    seasonCondition = `\nAND (
      season = ${'' + (season - 1) + season} OR 
      season = ${'' + season + (season + 1)}
    )`;
  }
  var type = req.query.type ? req.query.type.split(',') : [];
  type = type.map(type => "'" + type + "'");
  const homeTeam = req.query.homeTeam || '';
  const awayTeam = req.query.awayTeam || '';
  const dateRangeStart = req.query.dateRangeStart || null;
  const dateRangeEnd = req.query.dateRangeEnd || null;
  const dateConditions = [];
  if (dateRangeStart) dateConditions.push(`G.date_time_gmt >= '${dateRangeStart}T00:00:00Z'`);
  if (dateRangeEnd) dateConditions.push(`G.date_time_gmt <= '${dateRangeEnd}T00:00:00Z'`);
  const dateCondition = dateConditions.length ? `\nAND ${dateConditions.join(' AND ')}` : '';
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = 15;
  const offset = (page - 1) * pageSize;

  connection.query(`SELECT game_id, season, enum, T1.team_name AS home_team_name, T2.team_name AS away_team_name, away_goals, home_goals, date_time_gmt
  FROM games G
  INNER JOIN teams T1 ON T1.team_id = G.home_team_id
  INNER JOIN teams T2 ON T2.team_id = G.away_team_id 
  WHERE G.enum IN (${String(type)})
    AND T1.team_name LIKE '%${homeTeam}%'
    AND T2.team_name LIKE '%${awayTeam}%'${seasonCondition}${dateCondition}
  ORDER BY date_time_gmt
  LIMIT ${pageSize}
  OFFSET ${offset};`, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
};

const getSeasons = async (req, res) => {
  connection.query(`SELECT DISTINCT season from games;`, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
};

module.exports = {
  getGames,
  getSeasons
};
