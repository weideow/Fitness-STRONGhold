import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/authContexts';

const ClientBooking = () => {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('/schedules/available');
        setSchedules(response.data);
      } catch (err) {
        setError('Error fetching schedules');
      }
    };

    fetchSchedules();
  }, []);

  const handleBooking = async () => {
    if (!selectedSchedule) {
      setError('Please select a schedule');
      return;
    }

    try {
      const response = await axios.post(
        '/bookings',
        { schedule_id: selectedSchedule },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Booking confirmed!');
    } catch (err) {
        console.log(err)
      setError('Error making booking');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Book a Lesson</h2>
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <h3>Available Lessons</h3>
        <ul>
          {schedules.map((schedule) => (
            <li key={schedule.schedule_id} onClick={() => setSelectedSchedule(schedule.schedule_id)}>
              <div className="border p-2 mb-2">
                <p>{schedule.lesson_name}</p>
                <p>{schedule.available_date} at {schedule.available_time}</p>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleBooking} className="bg-blue-500 text-white p-2 rounded">Book Now</button>
      </div>
    </div>
  );
};

export default ClientBooking;