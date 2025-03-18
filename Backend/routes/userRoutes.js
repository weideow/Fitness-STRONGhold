const express = require('express');
const protect = require('../middleware/authMiddleware');
const { pool } = require('../config/database');


const router = express.Router();

// Trainer to check all posted availability
router.get('/availability', protect, async (req, res) => {
  if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      `SELECT schedule_id, trainer_id, lesson_name, available_date, available_time
       FROM schedules
       WHERE trainer_id = $1`,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/bookings', protect, async (req, res) => {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin' && req.user.role !== 'client') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  
    try {
      let query;
      let queryParams;
  
      if (req.user.role === 'client') {
        // Fetch bookings for the logged-in client
        query = `
          SELECT b.booking_id, b.schedule_id, b.lesson_name, b.available_date, b.available_time, 
                 u.user_name AS trainer_name
          FROM bookings b
          JOIN schedules s ON b.schedule_id = s.schedule_id
          JOIN users u ON s.trainer_id = u.user_id
          WHERE b.client_id = $1
        `;
        queryParams = [req.user.user_id];
      } else {
        // Fetch bookings for the trainer or admin
        query = `
          SELECT b.booking_id, b.client_id, b.schedule_id, 
                 b.lesson_name, b.available_date, b.available_time,
                 u.user_name AS client_name
          FROM bookings b
          JOIN users u ON b.client_id = u.user_id
          WHERE EXISTS (
            SELECT 1 FROM schedules s 
            WHERE s.schedule_id = b.schedule_id 
            AND s.trainer_id = $1
          )
        `;
        queryParams = [req.user.user_id];
      }
  
      const result = await pool.query(query, queryParams);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Trainer to post their availability
router.post('/availability', protect, async (req, res) => {
  if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { lesson_name, available_date, available_time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO schedules (trainer_id, lesson_name, available_date, available_time)
       VALUES ($1, $2, $3, $4)
       RETURNING schedule_id, trainer_id, lesson_name, available_date, available_time`,
      [req.user.user_id, lesson_name, available_date, available_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client to check available schedules
router.get('/available-schedule', protect, async (req, res) => {
  if (req.user.role !== 'client' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const schedules = await pool.query(
      `SELECT s.schedule_id, s.lesson_name, s.available_date, s.available_time, u.user_name AS trainer_name
       FROM schedules s
       JOIN users u ON s.trainer_id = u.user_id
       WHERE s.available_date >= CURRENT_DATE`
    );

    res.json(schedules.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client to make bookings
router.post('/bookings', protect, async (req, res) => {
  if (req.user.role !== 'client' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { schedule_id } = req.body;

  if (!schedule_id) {
    return res.status(400).json({ message: 'Schedule ID is required' });
  }

  try {
    // Fetch the schedule details
    const schedule = await pool.query(
      'SELECT * FROM schedules WHERE schedule_id = $1',
      [schedule_id]
    );

    if (schedule.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if the client has already booked this schedule
    const existingBooking = await pool.query(
      'SELECT * FROM bookings WHERE client_id = $1 AND schedule_id = $2',
      [req.user.user_id, schedule_id]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ message: 'You already booked this appointment' });
    }

    // Insert the booking
    const result = await pool.query(
      `INSERT INTO bookings (client_id, schedule_id, lesson_name, available_date, available_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING booking_id, lesson_name, available_date, available_time`,
      [req.user.user_id, schedule_id, schedule.rows[0].lesson_name, schedule.rows[0].available_date, schedule.rows[0].available_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trainer or admin to delete their availability
router.delete('/availability/:id', protect, async (req, res) => {
  if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    // Check if the availability exists
    const query = req.user.role === 'admin'
      ? 'SELECT * FROM schedules WHERE schedule_id = $1'
      : 'SELECT * FROM schedules WHERE schedule_id = $1 AND trainer_id = $2';

    const queryParams = req.user.role === 'admin'
      ? [id]
      : [id, req.user.user_id];

    const result = await pool.query(query, queryParams);

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

// Client to delete their bookings
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

    res.status(200).json({ message: 'Booking canceled successfully', booking: booking.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client to update their booking
router.put('/bookings/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { lesson_name, available_date, available_time } = req.body;

  if (req.user.role !== 'client') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // Check if the booking belongs to the client
    const booking = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = $1 AND client_id = $2',
      [id, req.user.user_id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    // Update the booking
    const result = await pool.query(
      `UPDATE bookings 
       SET lesson_name = COALESCE($1, lesson_name),
           available_date = COALESCE($2, available_date),
           available_time = COALESCE($3, available_time)
       WHERE booking_id = $4
       RETURNING *`,
      [lesson_name, available_date, available_time, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trainer or admin to update their availability
router.put('/availability/:id', protect, async (req, res) => {
  const { id } = req.params;
  const { lesson_name, available_date, available_time } = req.body;

  if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // Check if the schedule belongs to the trainer or admin
    const query = req.user.role === 'admin'
      ? 'SELECT * FROM schedules WHERE schedule_id = $1'
      : 'SELECT * FROM schedules WHERE schedule_id = $1 AND trainer_id = $2';

    const queryParams = req.user.role === 'admin'
      ? [id]
      : [id, req.user.user_id];

    const schedule = await pool.query(query, queryParams);

    if (schedule.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found or not authorized' });
    }

    // Update the schedule
    const result = await pool.query(
      `UPDATE schedules 
       SET lesson_name = COALESCE($1, lesson_name),
           available_date = COALESCE($2, available_date),
           available_time = COALESCE($3, available_time)
       WHERE schedule_id = $4
       RETURNING *`,
      [lesson_name, available_date, available_time, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Client to see their own bookings
router.get('/client/bookings', protect, async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // Fetch bookings for the logged-in client
    const result = await pool.query(
      `SELECT b.booking_id, b.schedule_id, b.lesson_name, b.available_date, b.available_time, 
              u.user_name AS trainer_name
       FROM bookings b
       JOIN schedules s ON b.schedule_id = s.schedule_id
       JOIN users u ON s.trainer_id = u.user_id
       WHERE b.client_id = $1`,
      [req.user.user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;