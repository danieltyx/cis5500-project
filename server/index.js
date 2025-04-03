const express = require('express');
const cors = require('cors');
const config = require('./db-config.js');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author);

app.listen(config.port, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`)
});

module.exports = app;
