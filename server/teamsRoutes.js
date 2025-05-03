var config = require("./db-config.js");
var mysql = require("mysql");

config.connectionLimit = 10;
var connection = mysql.createPool(config);
//query 1
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
