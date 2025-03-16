const express = require('express');
const { pool } = require('../config/database');
const protect = require('../middleware/authMiddleware');  

const router = express.Router();

router.get('/workouts', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT w.workout_id, w.workout_name, w.calories_burnt, w.description, u.user_name AS trainer_name
             FROM workouts w
             JOIN users u ON w.user_id = u.user_id`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/workouts/new', protect, async (req, res) => {
    const { workout_name, calories_burnt, description } = req.body;

    
    if (!workout_name || !calories_burnt || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        
        const result = await pool.query(
            `INSERT INTO workouts (workout_name, calories_burnt, description, user_id)
             VALUES ($1, $2, $3, $4)
             RETURNING workout_id, workout_name, calories_burnt, description`,
            [workout_name, calories_burnt, description, req.user.user_id] 
        );

   
        const newWorkout = result.rows[0];
        res.status(201).json({
            message: 'Workout created successfully',
            workout: newWorkout
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/workouts/:id', protect, async (req, res) => {
    const { id } = req.params;

    try {
        const workout = await pool.query(
            'SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2',  
            [id, req.user.user_id]  
        );

        if (workout.rows.length === 0) {
            return res.status(404).json({ message: 'Workout not found or not authorized' });
        }

        // Delete the workout
        await pool.query('DELETE FROM workouts WHERE workout_id = $1', [id]);

        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;