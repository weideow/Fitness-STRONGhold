import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router';
import AuthContext from './contexts/authContexts';
import LoginForm from './components/Login';
import ClientDashboard from './components/ClientDashBoard';
import TrainerDashboard from './components/TrainerDashboard';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={LoginForm} />
          <ProtectedRoute path="/clientdashboard" component={ClientDashboard} />
          <ProtectedRoute path="/trainerdashboard" component={TrainerDashboard} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;