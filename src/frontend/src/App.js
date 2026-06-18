import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import { getUserById } from './api/authApi';

// Decodes the middle (payload) segment of a JWT without verifying the signature.
// Signature verification is the server's responsibility; we only need the user ID.
function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// Root component.
// Owns all authentication state (token, user profile, restaurant-owner flag) and
// passes it down as props so every page and the Header stay in sync.
export default function App() {
  // Initialise token from localStorage so a page refresh keeps the session alive.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser]     = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true'; // localStorage saves as strings
  });

  // Add or remove the 'dark-mode' class on the body tag whenever state changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference to local storage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Intercept localStorage.setItem so LoginPage (which writes the token directly to
  // localStorage) automatically triggers a state update here without needing to be
  // modified. The original function is restored when App unmounts.
  useEffect(() => {
    const originalSetItem = localStorage.setItem.bind(localStorage);

    localStorage.setItem = function (key, value) {
      originalSetItem(key, value);
      if (key === 'token') setToken(value);
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Whenever the token changes, fetch the user's profile and read their
  // restaurant-owner flag straight off it (set at registration).
  // If the token is invalid or expired the server will reject the request, at which point
  // we clear the session so the UI returns to the logged-out state.
  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsOwner(false);
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded?.id) return;

    getUserById(decoded.id)
      .then((userData) => {
        setUser(userData);
        setIsOwner(!!userData.isRestaurantOwner);
      })
      .catch(() => {
        // Token is expired or invalid — clear the session.
        localStorage.removeItem('token');
        setToken(null);
      });
  }, [token]);

  // Called by components that do their own sign-out (e.g. the Header logout button).
  function signOut() {
    localStorage.removeItem('token');
    setToken(null);
  }

  // Session Initialization Guard 
  // If a token exists but the profile is still being fetched from the server,
  // we block navigation and show a clean layout using an early return statement.
  const isAuthenticating = token && !user;

  if (isAuthenticating) {
    return (
      <div className="app-initializing-container">
        <h3>Initializing session...</h3>
      </div>
    );
  }

  // Once completely loaded (or if no token exists), we safely proceed to the main return
  return (
    <BrowserRouter>
      <AppRouter
        token={token}
        user={user}
        isOwner={isOwner}
        signOut={signOut}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
    </BrowserRouter>
  );
}
