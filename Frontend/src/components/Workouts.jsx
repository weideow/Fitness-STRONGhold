import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [caloriesBurnt, setCaloriesBurnt] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('/workouts');
        setWorkouts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, []);

  const handleAddWorkout = async () => {
    try {
      const response = await axios.post('/workouts/new', {
        workout_name: workoutName,
        calories_burnt: caloriesBurnt,
        description
      });
      setWorkouts([...workouts, response.data.workout]);
    } catch (error) {
      console.error(error);
      alert('Failed to add workout');
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
      <button onClick={handleAddWorkout}>Add Workout</button>

      <div>
        {workouts.map((workout) => (
          <div key={workout.workout_id}>
            <p>{workout.workout_name}</p>
            <button onClick={() => handleDelete(workout.workout_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPage;