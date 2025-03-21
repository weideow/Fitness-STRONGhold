import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import AuthContext from '../contexts/authContexts';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {

    return <Navigate to="/login" />;
  }

  return children;  
};

export default ProtectedRoute;