import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  const login = async () => {
    try {
      // TODO: Implement Web3Auth login
      setLoggedIn(true);
      history.push('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to NHL Stats</h1>
        <p>Login to get started</p>
        
        {!loggedIn ? (
          <button onClick={login} className="login-button">
            Login
          </button>
        ) : (
          <div className="user-actions">
            <button onClick={() => history.push('/')} className="action-button">
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 