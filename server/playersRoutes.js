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

// GET /players
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


// GET /search_players 
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
    conditions.push(`(first_name LIKE '%${req.query.name}%' OR last_name LIKE '%${req.query.name}%')`);
  }
  if (req.query.position) {
    conditions.push(`primary_position LIKE '%${req.query.position}%'`);
  }
  if (req.query.nationality) {
    conditions.push(`nationality LIKE '%${req.query.nationality}%'`);
  }
  if (req.query.birth_city) {
    conditions.push(`birth_city LIKE '%${req.query.birth_city}%'`);
  }
  if (req.query.height_low && req.query.height_high) {
    conditions.push(`height_cm BETWEEN ${req.query.height_low} AND ${req.query.height_high}`);
  }

  if (conditions.length > 0) {
    baseQuery += ' AND ' + conditions.join(' AND ');
  }

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
      ${nationality ? 'WHERE p.nationality = $1' : ''}
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
      console.error('Database error:', err);
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data.rows);
    }
  });
};



module.exports = {
  get_players,
  searchPlayers,
  getNationalitySummary 
};