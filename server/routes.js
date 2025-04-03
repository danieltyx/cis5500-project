var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// Route 1: GET /author/:type
const author = async function(req, res) {
  const name = 'BriAadNatDan';
  const pennkey = 'band';

  // checks the value of type in the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.json returns data back to the requester via an HTTP response
    res.json({ data: name });
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back a JSON response with the pennkey
    res.json({ data: pennkey });
  } else {
    res.status(400).json({});
  }
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  author
}