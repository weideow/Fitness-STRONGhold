import React, { useContext } from 'react';
import { Link } from 'react-router'; 
import { AuthContext } from '../contexts/authContexts';
import Logout from './Logout';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/home">
            Home
          </Button>

          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}

          {user && (user.role === 'admin' || user.role === 'trainer') && (
            <>
              <Button color="inherit" component={Link} to="/dashboard/client">
                Client Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/dashboard/trainer">
                Trainer Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/workouts">
                Workouts
              </Button>
            </>
          )}

          {user && user.role === 'client' && (
            <>
              <Button color="inherit" component={Link} to="/dashboard/client">
                Client Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/workouts">
                Workouts
              </Button>
            </>
          )}

          {user && <Logout />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;