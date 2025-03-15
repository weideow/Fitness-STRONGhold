import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ClientDashboard = () => {
  const [availableSessions, setAvailableSessions] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAvailableSessions = async () => {
      try {
        const res = await axios.get('/api/schedules/available');
        setAvailableSessions(res.data);
      } catch (err) {
        setError('Failed to load available sessions');
        console.error(err);
      }
    };

    const fetchMyBookings = async () => {
      try {
        const res = await axios.get('/api/bookings/client');
        setMyBookings(res.data);
      } catch (err) {
        setError('Failed to load your bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSessions();
    fetchMyBookings();
  }, []);

  const bookSession = async (scheduleId) => {
    try {
      await axios.post('/api/bookings', { scheduleId });
      
      // Refresh both lists
      const availableRes = await axios.get('/api/schedules/available');
      const bookingsRes = await axios.get('/api/bookings/client');
      
      setAvailableSessions(availableRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      setError('Failed to book session');
      console.error(err);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: 'canceled' });
      
      // Refresh both lists
      const availableRes = await axios.get('/api/schedules/available');
      const bookingsRes = await axios.get('/api/bookings/client');
      
      setAvailableSessions(availableRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      setError('Failed to cancel booking');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Sessions</h2>
          
          {availableSessions.length === 0 ? (
            <p className="text-gray-500">No available sessions at the moment.</p>
          ) : (
            <div className="space-y-4">
              {availableSessions.map((session) => (
                <div 
                  key={session.schedule_id} 
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{session.lesson_name}</h3>
                    <p className="text-sm text-gray-600">
                      Trainer: {session.trainer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(session.available_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: {session.available_time}
                    </p>
                  </div>
                  <button
                    onClick={() => bookSession(session.schedule_id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
          
          {myBookings.length === 0 ? (
            <p className="text-gray-500">You haven't booked any sessions yet.</p>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => (
                <div 
                  key={booking.booking_id} 
                  className="border p-4 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{booking.lesson_name}</h3>
                      <p className="text-sm text-gray-600">
                        Trainer: {booking.trainer_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(booking.available_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time: {booking.available_time}
                      </p>
                      <span 
                        className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'canceled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    {booking.status !== 'canceled' && (
                      <button
                        onClick={() => cancelBooking(booking.booking_id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;