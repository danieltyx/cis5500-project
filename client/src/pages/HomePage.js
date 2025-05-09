import React from "react";
import { Link } from "react-router-dom";
import "../style/HomePage.css";

//DONE1
function HomePage() {
  return (
    <div className="home-page">
      <div className="banner">
        <div className="banner-content">
          <h1>Welcome to NHL Game Statistics</h1>
          <p>
            Your ultimate destination for comprehensive NHL statistics and
            analysis
          </p>
          <div className="banner-buttons">
            <Link to="/players" className="banner-button">
              Explore Players
            </Link>
            <Link to="/teams" className="banner-button">
              View Teams
            </Link>
            <Link to="/games" className="banner-button">
              Check Games
            </Link>{" "}
            {/*link to all the pages */}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Player Statistics</h3>
            <p>Comprehensive player stats including goals, assists, and more</p>
          </div>
          <div className="feature-card">
            <h3>Team Analysis</h3>
            <p>Detailed team performance metrics and standings</p>
          </div>
          <div className="feature-card">
            <h3>Game Results</h3>
            <p>Real-time game scores and historical match data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
