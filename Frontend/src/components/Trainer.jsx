import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/authContexts';

const TrainerAvailability = () => {
  const { user } = useContext(AuthContext);
  const [lessonName, setLessonName] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lessonName || !availableDate || !availableTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(
        '/api/schedules/availability',
        { lesson_name: lessonName, available_date: availableDate, available_time: availableTime },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Availability added successfully');
    } catch (err) {
        console.log(err)
      setError('Error adding availability');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Add Availability</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Lesson Name</label>
          <input
            type="text"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div>
          <label>Available Date</label>
          <input
            type="date"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div>
          <label>Available Time</label>
          <input
            type="time"
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Availability</button>
      </form>
    </div>
  );
};

export default TrainerAvailability;