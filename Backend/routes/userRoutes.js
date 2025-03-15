const express = require('express');
const protect = require('../middleware/authMiddleware');
const {pool} = require('../config/database');

const router = express.Router();

//trainer to check all posted availability
router.get('/availability', protect, async (req, res) => {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const result = await pool.query(
            `SELECT schedule_id, trainer_id, lesson_name, available_date, available_time
            FROM schedules
            WHERE trainer_id = $1`,
            [req.user.user_id] // Only get the trainer's availability
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


//trainer route to post their availability
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

// client to make bookings if available
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

// trainer to delete their availability
router.delete('/availability/:id', protect, async (req, res) => {
    if (req.user.role !== 'trainer') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    try {
        // Check if the trainer owns the availability
        const result = await pool.query(
            `SELECT * FROM schedules WHERE schedule_id = $1 AND trainer_id = $2`,
            [id, req.user.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        // Delete the availability
        await pool.query('DELETE FROM schedules WHERE schedule_id = $1', [id]);

        res.status(200).json({ message: 'Availability deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// client to delete the bookings they made
router.delete('/bookings/:id', protect, async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await pool.query(
            'SELECT * FROM bookings WHERE booking_id = $1 AND client_id = $2',
            [id, req.user.user_id]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found or not authorized' });
        }

        // Delete the booking
        await pool.query('DELETE FROM bookings WHERE booking_id = $1', [id]);

        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

   

