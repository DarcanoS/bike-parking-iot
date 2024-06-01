import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, adminOnly }) {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
