import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import '../style/NavBar.css';

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
  const [user, setUser] = useState(null);
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      history.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={handleSignOut} className="sign-out-button">
                SIGN OUT
              </button>
            </div>
          ) : (
            <NavText href="/login" text="SIGN IN" />
          )}
        </div>
      </div>
    </div>
  );
}
  
