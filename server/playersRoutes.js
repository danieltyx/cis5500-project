const { Pool, types } = require('pg');
var config = require("./db-config.js");

config.connectionLimit = 10;
console.log('trying to make a connection');
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

// GET /player/:id
const getPlayerById = async (req, res) => {
  const playerId = req.params.id;
  connection.query(
    `SELECT player_id, first_name, last_name, nationality, birth_city, primary_position, birth_date, height_cm
     FROM players
     WHERE player_id = ${playerId};`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data[0]);
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

module.exports = {
  get_players,
  getPlayerById,
  searchPlayers,
};
