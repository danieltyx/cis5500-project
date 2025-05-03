import React from 'react';
import { NavLink } from 'react-router-dom';

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
        <NavText href="/" text="SWIFTIFY" isMain />
        <NavText href="/players" text="PLAYERS" />
        <NavText href="/teams" text="TEAMS" />
        <NavText href="/games" text="GAMES" />
      </div>
    </div>
  );
}
