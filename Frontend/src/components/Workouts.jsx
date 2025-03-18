import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [caloriesBurnt, setCaloriesBurnt] = useState('');
  const [description, setDescription] = useState('');
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchWorkouts();
  }, [baseUrl]);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Fetching workouts with token:", token ? "Token exists" : "No token");
      const response = await axios.get(`${baseUrl}/workouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Workouts response:", response.data);
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error.response || error);
      alert('Failed to fetch workouts. Please check console for details.');
    }
  };

  const handleAddWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${baseUrl}/workouts/new`, 
        {
          workout_name: workoutName,
          calories_burnt: caloriesBurnt,
          description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setWorkouts([...workouts, response.data.workout]);
      setWorkoutName('');
      setCaloriesBurnt('');
      setDescription('');
      fetchWorkouts(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding workout:", error.response || error);
      alert('Failed to add workout');
    }
  };

  const handleDelete = async (workoutId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(workouts.filter(workout => workout.workout_id !== workoutId));
    } catch (error) {
      console.error("Error deleting workout:", error.response || error);
      alert('Failed to delete workout');
    }
  };

  const handleEdit = (workout) => {
    setWorkoutName(workout.workout_name);
    setCaloriesBurnt(workout.calories_burnt);
    setDescription(workout.description);
    setEditingWorkoutId(workout.workout_id);
  };

  const handleUpdateWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${baseUrl}/workouts/${editingWorkoutId}`, 
        {
          workout_name: workoutName,
          calories_burnt: caloriesBurnt,
          description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchWorkouts(); // Refresh the list after updating
      setWorkoutName('');
      setCaloriesBurnt('');
      setDescription('');
      setEditingWorkoutId(null);
    } catch (error) {
      console.error("Error updating workout:", error.response || error);
      alert('Failed to update workout');
    }
  };

  return (
    <div>
      <h2>Manage Workouts</h2>
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Calories Burnt"
        value={caloriesBurnt}
        onChange={(e) => setCaloriesBurnt(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {editingWorkoutId ? (
        <button onClick={handleUpdateWorkout}>Update Workout</button>
      ) : (
        <button onClick={handleAddWorkout}>Add Workout</button>
      )}

      <div>
        <h3>Workouts List</h3>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout.workout_id} style={{border: '1px solid #ccc', margin: '10px 0', padding: '10px'}}>
              <h4>{workout.workout_name}</h4>
              <p>Calories: {workout.calories_burnt}</p>
              <p>Description: {workout.description}</p>
              <p>Trainer: {workout.trainer_name}</p>
              <button onClick={() => handleEdit(workout)}>Edit</button>
              <button onClick={() => handleDelete(workout.workout_id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No workouts found. Add a new workout to get started.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;