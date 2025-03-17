import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router'; 
import ClientDashboard from './components/ClientDashBoard';
import TrainerDashboard from './components/TrainerDashboard';
import LoginForm from './components/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/authContexts';
import Register from './components/Register';
import WorkoutPage from './components/Workouts';
import ProtectedRoute from './components/Protected';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/trainer" element={<ProtectedRoute><TrainerDashboard /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><WorkoutPage /></ProtectedRoute>} />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;