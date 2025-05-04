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

app.get('/players', routes.get_players);
app.get('/search_players', routes.searchPlayers);
app.get('/nationality_summary', routes.getNationalitySummary);
app.get('/teams', routes.getTeams);
app.get('/find_games', routes.getGames);
app.get('/shot_types', routes.getShotTypeStats);
app.get('/lopsided_games', routes.getLopsidedGames);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
