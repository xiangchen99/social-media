import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Feed from './components/Feed'; // This is now your main protected view
import Profile from './components/Profile'; // Import the new Profile component
import LogoutButton from './components/LogoutButton'; // Import LogoutButton
import HomePage from './components/HomePage'; // Import HomePage component
import EditProfile from './components/EditProfile'; // Import EditProfile component

// Configure Axios base URL
import axios from 'axios';
axios.defaults.baseURL = "https://social-media-chi-black.vercel.app";
// If you are running the backend locally, you can uncomment the line below
//axios.defaults.baseURL = "http://localhost:3001"; // Use this for local

const App = () => {
  const token = localStorage.getItem('token');
  let currentUserId = null;

  if (token) {
    try {
      // Decode the token to get the user ID
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      currentUserId = decodedToken.user.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle invalid token, e.g., clear it from localStorage
      localStorage.removeItem('token');
    }
  }

  return (
    <BrowserRouter>
      <nav style={{ backgroundColor: '#333', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
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
          {token && ( // Show Dashboard and My Profile if logged in
            <>
              <li style={{ marginRight: '20px' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              </li>
              {currentUserId && ( // Ensure currentUserId is available before showing My Profile link
                <li>
                  <Link to={`/profile/${currentUserId}`} style={{ color: 'white', textDecoration: 'none' }}>My Profile</Link>
                </li>
              )}
            </>
          )}
        </ul>
        {token && <LogoutButton />} {/* Show Logout button if logged in */}
      </nav>

      <Routes>
        <Route path="/" element={token ? <PrivateRoute><Feed /></PrivateRoute> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;