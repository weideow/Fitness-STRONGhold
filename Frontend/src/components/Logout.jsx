import React, { useContext } from 'react';
import { AuthContext } from '../contexts/authContexts';

const Logout = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); 
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  );
};

export default Logout;