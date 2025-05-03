import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavText({ href, text, isMain }) {
  return (
    <div className={`nav-text ${isMain ? 'main' : ''}`}>
      <NavLink to={href} className="nav-link">
        {text}
      </NavLink>
    </div>
  );
}

export default function NavBar() {
    return (
      <div className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <NavText href="/" text="NHL Game Statistics" isMain />
            <NavText href="/players" text="PLAYERS" />
            <NavText href="/teams" text="TEAMS" />
            <NavText href="/games" text="GAMES" />
          </div>
          <div className="navbar-right">
            <NavText href="/login" text="SIGN IN" />
          </div>
        </div>
      </div>
    );
  }
  
