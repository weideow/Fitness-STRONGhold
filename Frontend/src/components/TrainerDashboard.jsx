import React from 'react';
import TrainerAvailability from './Trainer';
import { Container, Typography } from '@mui/material';

const TrainerDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        
      </Typography>
      <TrainerAvailability />
    </Container>
  );
};

export default TrainerDashboard;