import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // 🔥 checking if user has token

  // If token exists -> allow access
  if (token) {
    return children;
  } else {
    // If no token -> redirect to login page
    console.log('No token found, redirecting to login...');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
