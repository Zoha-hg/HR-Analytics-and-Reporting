import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated'); // Or however you're tracking auth status

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default ProtectedRoute;
