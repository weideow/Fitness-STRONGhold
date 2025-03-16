const express = require('express');
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

router.post('/', async (req, res) => {
  const { user_name, email, password, role } = req.body;

  if (!user_name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (user_name, email, hashed_password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, user_name, email, role',
      [user_name, email, hashedPassword, role || 'client']
    );
    
    const newUser = result.rows[0];
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        user_name: newUser.user_name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser.user_id, newUser.role)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;