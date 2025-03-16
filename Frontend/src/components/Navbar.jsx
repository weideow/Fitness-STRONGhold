import React from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/dashboard/client">Client Dashboard</Link></li>
        <li><Link to="/dashboard/trainer">Trainer Dashboard</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;