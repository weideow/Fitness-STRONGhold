import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/authContexts';
import { useNavigate } from 'react-router';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';

const Trainer = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch trainer data (availabilities and bookings)
  const fetchTrainerData = async () => {
    if (!user) return;

    try {
      const token = user.token;

      // Fetch availabilities
      const availabilitiesRes = await axios.get(`${baseUrl}/user/availability`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailabilities(availabilitiesRes.data || []);

      // Fetch bookings
      const bookingsRes = await axios.get(`${baseUrl}/user/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount or when user changes
  useEffect(() => {
    if (user) {
      fetchTrainerData();
    }
  }, [user]);

  // Delete an availability slot
  const deleteAvailability = async (scheduleId) => {
    if (!user) return;

    try {
      const token = user.token;
      await axios.delete(`${baseUrl}/user/availability/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrainerData(); // Refresh data after deletion
      setError('');
    } catch (err) {
      setError('Failed to delete availability');
      console.error(err);
    }
  };

  // Delete a booking
  const deleteBooking = async (bookingId) => {
    if (!user) return;

    try {
      const token = user.token;
      await axios.delete(`${baseUrl}/user/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrainerData(); // Refresh data after deletion
      setError('');
    } catch (err) {
      setError('Failed to delete booking');
      console.error(err);
    }
  };

  // Redirect to login if user is not authenticated
  if (!user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="body1">Please log in to access the Trainer Dashboard.</Typography>
      </Container>
    );
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trainer Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* My Available Slots */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              My Available Slots
            </Typography>
            {Array.isArray(availabilities) && availabilities.length > 0 ? (
              availabilities.map((slot) => (
                <Card key={slot.schedule_id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">{slot.lesson_name}</Typography>
                    <Typography variant="body2">Date: {slot.available_date}</Typography>
                    <Typography variant="body2">Time: {slot.available_time}</Typography>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteAvailability(slot.schedule_id)}
                      sx={{ mt: 1 }}
                    >
                      Delete Availability
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2">No available slots found.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Client Bookings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Client Bookings
            </Typography>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.booking_id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1">{booking.lesson_name}</Typography>
                    <Typography variant="body2">Client: {booking.client_name}</Typography>
                    <Typography variant="body2">Date: {booking.available_date}</Typography>
                    <Typography variant="body2">Time: {booking.available_time}</Typography>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteBooking(booking.booking_id)}
                      sx={{ mt: 1 }}
                    >
                      Cancel Booking
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2">No bookings found.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Trainer;