import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      
      fetchUserData();
    }
  }, []);

 
  const fetchUserData = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/auth/user`); 
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
      logout();
    }
  };

  
  const login = async (userData) => {
    try {
      setUser(userData); 
      localStorage.setItem('token', userData.token); 
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`; 
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  
  const logout = () => {
    setUser(null); 
    localStorage.removeItem('token'); 
    delete axios.defaults.headers.common['Authorization']; 
  };

 
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;