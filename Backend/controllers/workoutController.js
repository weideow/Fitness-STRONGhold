const express = require('express');
const { pool } = require('../config/database');
const protect = require('../middleware/authMiddleware'); 


const router = express.Router();



const getWorkouts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT w.workout_id, w.workout_name, w.calories_burnt, w.description, u.user_name AS trainer_name
             FROM workouts w
             JOIN users u ON w.user_id = u.user_id`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

const createWorkout = async (req, res) => {
    const { workout_name, calories_burnt, description } = req.body;
    const trainerId = req.user.user_id; 

    try {
        const result = await pool.query(
            `INSERT INTO workouts (workout_name, calories_burnt, description, user_id)
             VALUES ($1, $2, $3, $4)
             RETURNING workout_id, workout_name, calories_burnt, description, user_id`,
            [workout_name, calories_burnt, description, trainerId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteWorkout = async (req, res) => {
    const { id } = req.params; 

    try {
        const workout = await pool.query(
            'SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2',
            [id, req.user.user_id] 
        );
        
        if (workout.rows.length === 0) {
            return res.status(404).json({ message: 'Workout not found or not authorized' });
        }
       
        await pool.query('DELETE FROM workouts WHERE workout_id = $1', [id]);

        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateWorkout = async (req, res) => {
    const { id } = req.params;
    const { workout_name, calories_burnt, description } = req.body;
    const trainerId = req.user.user_id;

    try {
        const workout = await pool.query(
            'SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2',
            [id, trainerId]
        );

        if (workout.rows.length === 0) {
            return res.status(404).json({ message: 'Workout not found or not authorized' });
        }

        const result = await pool.query(
            `UPDATE workouts
             SET workout_name = $1, calories_burnt = $2, description = $3
             WHERE workout_id = $4
             RETURNING workout_id, workout_name, calories_burnt, description, user_id`,
            [workout_name, calories_burnt, description, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


router.get('/workouts', getWorkouts);
router.post('/workouts', protect, createWorkout);  
router.delete('/workouts/:id', protect, deleteWorkout);  
router.put('/workouts/:id', protect, updateWorkout);  


module.exports = router;
