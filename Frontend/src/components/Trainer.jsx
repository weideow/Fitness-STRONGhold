import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/authContexts';

const Trainer = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    lesson_name: '',
    available_date: '',
    available_time: ''
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const availabilitiesRes = await axios.get('/schedules/trainer');
        const bookingsRes = await axios.get('/bookings/trainer');
        
        setAvailabilities(availabilitiesRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('/api/schedules', formData);
      
      // Reset form
      setFormData({
        lesson_name: '',
        available_date: '',
        available_time: ''
      });
      
      // Refresh availabilities
      const res = await axios.get('/api/schedules/trainer');
      setAvailabilities(res.data);
    } catch (err) {
      setError('Failed to add availability');
      console.error(err);
    }
  };

  const deleteAvailability = async (scheduleId) => {
    try {
      await axios.delete(`/api/schedules/${scheduleId}`);
      
      // Refresh availabilities
      const res = await axios.get('/api/schedules/trainer');
      setAvailabilities(res.data);
    } catch (err) {
      setError('Failed to delete availability');
      console.error(err);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status });
      
      // Refresh bookings
      const res = await axios.get('/api/bookings/trainer');
      setBookings(res.data);
    } catch (err) {
      setError(`Failed to ${status} booking`);
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Availability</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lesson_name">
                  Lesson Name
                </label>
                <input
                  type="text"
                  id="lesson_name"
                  name="lesson_name"
                  value={formData.lesson_name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="available_date">
                  Date
                </label>
                <input
                  type="date"
                  id="available_date"
                  name="available_date"
                  value={formData.available_date}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="available_time">
                  Time
                </label>
                <input
                  type="time"
                  id="available_time"
                  name="available_time"
                  value={formData.available_time}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Availability
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">My Available Slots</h2>
            
            {availabilities.length === 0 ? (
              <p className="text-gray-500">You haven't added any available slots yet.</p>
            ) : (
              <div className="space-y-4">
                {availabilities.map((slot) => (
                  <div 
                    key={slot.schedule_id} 
                    className="border p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{slot.lesson_name}</h3>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(slot.available_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time: {slot.available_time}
                      </p>
                      {slot.is_booked && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded mt-1">
                          Booked
                        </span>
                      )}
                    </div>
                    
                    {!slot.is_booked && (
                      <button
                        onClick={() => deleteAvailability(slot.schedule_id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Client Bookings</h2>
          
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div 
                  key={booking.booking_id} 
                  className="border p-4 rounded"
                >
                  <h3 className="font-medium">{booking.lesson_name}</h3>
                  <p className="text-sm text-gray-600">
                    Client: {booking.client_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(booking.available_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {booking.available_time}
                  </p>
                  
                  <div className="mt-2 flex items-center">
                    <span 
                      className={`inline-block px-2 py-1 text-xs rounded mr-2 ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'canceled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateBookingStatus(booking.booking_id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.booking_id, 'canceled')}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
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

export default Trainer;