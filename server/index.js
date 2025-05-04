const express = require('express');
const cors = require('cors');
const config = require('./db-config.js');
const routes = require('./routes');
const playerRoutes = require('./playersRoutes.js');
const gameRoutes = require('./gameRoutes.js');
const teamRoutes = require('./teamsRoutes.js');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/author/:type', routes.author);
app.get('/players', playerRoutes.get_players);
app.get('/search_players', playerRoutes.searchPlayers);
app.get('/teams', teamRoutes.getTeams);
app.get('/find_games', gameRoutes.getGames);
app.get('/shot_types', gameRoutes.getShotTypeStats);
app.get('/nationality_summary', playerRoutes.getNationalitySummary);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
