import React, { useContext } from 'react';
import { Link } from 'react-router'; 
import { useNavigate } from 'react-router';
import AuthContext from '../contexts/authContexts';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4">
        <li><Link to="/login" className="text-white hover:underline">Login</Link></li>
        <li><Link to="/dashboard/client" className="text-white hover:underline">Client Dashboard</Link></li>
        <li><Link to="/dashboard/trainer" className="text-white hover:underline">Trainer Dashboard</Link></li>
        <li><Link to="/register" className="text-white hover:underline">Register</Link></li>
        <li><Link to="/workouts" className="text-white hover:underline">Workouts</Link></li>
        <li><button onClick={logout} className="text-white hover:text-blue-200">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;