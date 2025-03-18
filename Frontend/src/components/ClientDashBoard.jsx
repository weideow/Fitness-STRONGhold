import React from 'react';
import ClientBooking from './Client';
import { Container, Typography } from '@mui/material';

const ClientDashboard = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        
      </Typography>
      <ClientBooking />
    </Container>
  );
};

export default ClientDashboard;