import React, { useContext } from 'react';
import { AuthContext } from '../contexts/authContexts';
import Logout from './Logout';
import { Container, Typography, Paper, Button, Box } from '@mui/material';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Your Fitness Stronghold
        </Typography>

        {user && (
          <Typography variant="h6" gutterBottom>
            Hello, {user.user_name}!
          </Typography>
        )}

        <Typography variant="body1" paragraph>
          Ready to crush your fitness goals?
        </Typography>




      </Paper>
    </Container>
  );
};

export default Home;
