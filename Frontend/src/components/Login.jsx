import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import AuthContext from '../contexts/authContexts';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      login(response.data);
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;