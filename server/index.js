const express = require("express");
const cors = require("cors");
const config = require("./db-config.js");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "NHL Stats API is running" });
});

// Player Routes
app.get("/players", routes.get_players);
app.get("/search_players", routes.searchPlayers);
app.get("/nationality_summary", routes.getNationalitySummary);

// Game Routes
app.get("/find_games", routes.getGames);
app.get("/shot_types", routes.getShotTypeStats);
app.get("/lopsided_games", routes.getLopsidedGames);
app.get("/exp_winner_xy", routes.getAvgXYExperiencedWinner);

// Team Routes
app.get("/teams", routes.getTeams);
app.get("/teams/offense-x", routes.offense_x);
app.get("/teams/total-goals", routes.total_goals);
app.get("/teams/avg-goals", routes.avg_goals);
app.get("/teams/records", routes.getRecords);
app.get("/teams/final-to-early-ratio", routes.finalToEarlyRatio);
app.get("/aggravated-stats", routes.getAggravatedStats);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.use((req, res) => {
  console.log("404 Not Found:", req.url);
  res.status(404).json({ error: "Not Found", path: req.url });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(config.server_port, () => {
    console.log(
      `Server running at http://${config.server_host}:${config.server_port}/`
    );
  });
}

module.exports = app;
