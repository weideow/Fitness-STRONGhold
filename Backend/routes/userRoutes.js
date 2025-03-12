const express = require('express');
const protect = require('../middleware/authMiddleware');
const {pool} = require('../config/database');

const router = express.Router();

router.post('/availability', protect, async(req,res)=> {
    if (req.user.role != 'trainer') {
        return res.status(403).json({message:'Unauthorized'});
    }
    const {lesson_name, available_date, available_time} = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO schedules(trainer_id, lesson_name, available_date, available_time)
            [req.user.user_id, lesson_name, available_date, available_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
    res.status(500).json({message: 'Server error'});
    }
});