import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/login'); // Redirect to login page
    window.location.reload(); // Optional: force a refresh to clear all state
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: '#f44336',
        color: 'white',
        padding: '8px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em'
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
