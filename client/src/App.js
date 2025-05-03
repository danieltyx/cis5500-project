import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import GamesPage from './pages/GamesPage';

export default function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '1rem', color: '#1a237e' }}>
        NHL Game Statistics
      </h1>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/players" component={PlayersPage} />
          <Route path="/teams" component={TeamsPage} />
          <Route path="/games" component={GamesPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
