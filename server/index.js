const express = require('express');
const cors = require('cors');
const config = require('./db-config.js');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cis5500-project.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'NHL Stats API is running' });
});

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/players', routes.get_players);
app.get('/search_players', routes.searchPlayers);
app.get('/nationality_summary', routes.getNationalitySummary);
app.get('/teams', routes.getTeams);
app.get('/find_games', routes.getGames);
app.get('/shot_types', routes.getShotTypeStats);
app.get('/lopsided_games', routes.getLopsidedGames);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
  });
}

module.exports = app;
