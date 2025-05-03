import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import GamesPage from './pages/GamesPage';
import SignupPage from './pages/SignupPage';
import Login from './components/Login';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/players" component={PlayersPage} />
          <Route path="/teams" component={TeamsPage} />
          <Route path="/games" component={GamesPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
