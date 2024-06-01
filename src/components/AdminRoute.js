import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

function AdminRoute({ children }) {
  const { currentUser, role } = useAuth();

  return currentUser && role === 'admin' ? children : <Navigate to="/" />;
}

export default AdminRoute;
