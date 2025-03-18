import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import ClientDashboard from './components/ClientDashBoard';
import TrainerDashboard from './components/TrainerDashboard';
import LoginForm from './components/Login';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './contexts/authContexts';
import Register from './components/Register';
import WorkoutPage from './components/Workouts';
import ProtectedRoute from './components/Protected';
import Home from './components/Home';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

 
  const showNavbar = user && location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/trainer" element={<ProtectedRoute><TrainerDashboard /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute><WorkoutPage /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;