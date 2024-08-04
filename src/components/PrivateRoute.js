import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuthContext();

  return auth ? children : <Navigate to="/" />;
};

export default PrivateRoute;
