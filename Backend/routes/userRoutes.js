const express = require('express');
const protect = require('../middleware/authMiddleware');
const {pool} = require('../config/database');

const router = express.Router();

//trainer route
router.post('/availability', protect, async(req,res)=> {
    if (req.user.role !== 'trainer') {
        return res.status(403).json({message:'Unauthorized'});
    }
    const {lesson_name, available_date, available_time} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO schedules(trainer_id, lesson_name, available_date, available_time )
            VALUES ($1, $2, $3, $4)
            RETURNING schedule_id, trainer_id, lesson_name, available_date, available_time`,
            [req.user.user_id, lesson_name, available_date, available_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
    res.status(500).json({message: 'Server error'});
    }
});

//client route to check available schedules
router.get('/available-schedule', protect, async(req,res) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({message:'Unauthorized'}) ;
    } 
    
    try {

        const schedule = await pool.query(
            `SELECT s.schedule_id, s.lesson_name, s.available_date, s.available_time, u.user_name AS trainer_name
            FROM schedules s
            JOIN users u ON s.trainer_id = u.user_id
            WHERE s.availability_date >= CURRENT_DATE`
        );

        res.json(schedules.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
    
});

router.post('/booking', protect, async(req,res) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({message:'Unauthorized'});
    }

    const {schedule_id} = req.body;

    if (!schedule_id) {
        return res.status(400).json({message:'Schedule ID is required'});
    }

    try {
        const schedule = await pool.query('SELECT * FROM schedules WHERE schedule_id = $1', [schedule_id]);

    if (schedule.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if client has already booked this schedule
    const existingBooking = await pool.query(
      'SELECT * FROM bookings WHERE client_id = $1 AND schedule_id = $2',
      [req.user.user_id, schedule_id]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ message: 'You already booked this appointment' });
    }

    // Create booking
    const result = await pool.query(
      'INSERT INTO bookings (client_id, schedule_id, status) VALUES ($1, $2, $3) RETURNING booking_id, status',
      [req.user.user_id, schedule_id, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

   
// GET/availability
// DELETE/availability
// GET/bookings
// DELETE/bookings
// GET/workout
// DELETE/workout

