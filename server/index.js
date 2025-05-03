const express = require('express');
const cors = require('cors');
const config = require('./db-config.js');
const routes = require('./routes');
const playerRoutes = require('./playersRoutes.js');
const gameRoutes = require('./gameRoutes.js');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/author/:type', routes.author);
// app.get('/team/offense_x', routes.offense_x);
// app.get('/teams/total_goals', routes.total_goals);
// app.get('/teams/avg_goals', routes.avg_goals);
// app.get('/teams/players', routes.player_count);
// app.get('/teams/average-height', routes.average_height);
// app.get('/games/ties', routes.tied_games);
app.get('/players', playerRoutes.get_players);
app.get('/player/:id', playerRoutes.getPlayerById);
app.get('/search_players', playerRoutes.searchPlayers);
app.get('/games', gameRoutes.get_games);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
