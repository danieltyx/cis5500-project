import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import './Login.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isSignUp ? 'Create Account' : 'Welcome to NHL Stats'}</h1>
        <p>{isSignUp ? 'Sign up to get started' : 'Sign in to continue'}</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>
        
        <div className="social-buttons">
          <button 
            onClick={handleGoogleSignIn} 
            className="social-button google"
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="social-icon"
            />
            Continue with Google
          </button>
          
          <button 
            onClick={handleFacebookSignIn} 
            className="social-button facebook"
          >
            <img 
              src="https://www.facebook.com/favicon.ico" 
              alt="Facebook" 
              className="social-icon"
            />
            Continue with Facebook
          </button>
        </div>
        
        <button 
          onClick={() => setIsSignUp(!isSignUp)} 
          className="toggle-button"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}

export default Login; 