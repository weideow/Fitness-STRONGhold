import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/authContexts';
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';

const ClientBooking = () => {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch available schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseUrl}/user/available-schedule`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data);
        setError('');
      } catch (err) {
        setError('Error fetching schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [baseUrl]);

  // Handle booking creation
  const handleBooking = async () => {
    if (!selectedSchedule) {
      setError('Please select a schedule');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${baseUrl}/user/bookings`, 
        { schedule_id: selectedSchedule },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Booking confirmed!');
      fetchBookings();
      setSelectedSchedule(null);
      setError('');
    } catch (err) {
      console.log(err);
      setError('Error making booking');
    }
  };

  // Fetch client's bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await axios.get(`${baseUrl}/user/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data || []);
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('You do not have permission to view bookings.');
      } else {
        setError('Error fetching bookings');
      }
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [user.token]);

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/user/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Booking canceled successfully!');
      fetchBookings(); // Refresh bookings after deletion
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to cancel booking');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" gutterBottom>
        Book a Lesson
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Available Schedules */}
      <div>
        <Typography variant="h6" component="h3" gutterBottom>
          Available Lessons
        </Typography>
        <List>
          {schedules.map((schedule) => (
            <ListItem
              key={schedule.schedule_id}
              onClick={() => setSelectedSchedule(schedule.schedule_id)}
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedSchedule === schedule.schedule_id ? 'lightblue' : 'white',
                '&:hover': { backgroundColor: '#f0f0f0' },
                mb: 1,
                borderRadius: '4px',
              }}
            >
              <Card variant="outlined" sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1">{schedule.lesson_name}</Typography>
                  <Typography variant="body2">
                    {schedule.available_date} at {schedule.available_time}
                  </Typography>
                  {selectedSchedule === schedule.schedule_id && (
                    <Typography variant="caption" color="primary">
                      Selected
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={handleBooking}>
          Book Now
        </Button>
      </div>

      {/* Client's Bookings */}
      <div sx={{ mt: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Your Bookings
        </Typography>
        <List>
          {bookings.map((booking) => (
            <ListItem key={booking.booking_id} sx={{ mb: 1 }}>
              <Card variant="outlined" sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1">{booking.lesson_name}</Typography>
                  <Typography variant="body2">
                    {booking.available_date} at {booking.available_time}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteBooking(booking.booking_id)}
                    sx={{ mt: 1 }}
                  >
                    Cancel Booking
                  </Button>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  );
};

export default ClientBooking;