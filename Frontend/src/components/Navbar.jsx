import React from 'react';
import { Link } from 'react-router'; 

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <ul className="flex space-x-4">
        <li><Link to="/login" className="text-white hover:underline">Login</Link></li>
        <li><Link to="/dashboard/client" className="text-white hover:underline">Client Dashboard</Link></li>
        <li><Link to="/dashboard/trainer" className="text-white hover:underline">Trainer Dashboard</Link></li>
        <li><Link to="/register" className="text-white hover:underline">Register</Link></li>
        <li><Link to="/workouts" className="text-white hover:underline">Workouts</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;