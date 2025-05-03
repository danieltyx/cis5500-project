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

const get_games = async (req, res) => {
  connection.query(`SELECT *
  FROM games G
  JOIN teams HT ON G.home_team_id = HT.team_id
  JOIN teams AT ON G.away_team_id = AT.team_id
  ORDER BY G.date_time_gmt;;`, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
};

module.exports = {
  get_games
};
