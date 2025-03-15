import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import ClientDashboard from './components/ClientDashBoard';
import TrainerDashboard from './components/TrainerDashboard';
import LoginForm from './components/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/authContexts';
import RegisterForm from './components/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;