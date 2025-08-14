import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Feed from './components/Feed'; // This is now your main protected view
import Profile from './components/Profile'; // Import the new Profile component
import LogoutButton from './components/LogoutButton'; // Import LogoutButton
import HomePage from './components/HomePage'; // Import HomePage component

// Configure Axios base URL
import axios from 'axios';
axios.defaults.baseURL = "https://social-media-chi-black.vercel.app";
// If you are running the backend locally, you can uncomment the line below
//axios.defaults.baseURL = "http://localhost:3001"; // Use this for local

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Use state for token

  // Listen for storage changes to update token state
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    // Listen for custom storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event we'll dispatch when token changes
    window.addEventListener('tokenChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <nav style={{ backgroundColor: '#333', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/homepage" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
          </li>
          {!token && ( // Show Register/Login if not logged in
            <>
              <li style={{ marginRight: '20px' }}>
                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              </li>
            </>
          )}
          {token && ( // Show Dashboard if logged in
            <li>
              <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            </li>
          )}
        </ul>
        {token && <LogoutButton />} {/* Show Logout button if logged in */}
      </nav>

      <Routes>
        <Route path="/" element={token ? <PrivateRoute><Feed /></PrivateRoute> : <HomePage />} /> {/* Default route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} /> {/* New profile route */}
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;