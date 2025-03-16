const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../utils/jwt');

const registerUser = async (req, res) => {
    const { email, password, user_name, role } = req.body;
  
    try {
      // Check if user already exists
      const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
  
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user
      const result = await pool.query(
        'INSERT INTO users (user_name, email, hashed_password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, user_name, email, role',
        [user_name, email, hashedPassword, role]
      );
  
      const user = result.rows[0];
  
      res.status(201).json({
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.user_id, user.role),
        
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check for user email
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
  
      const user = result.rows[0];
  
      if (user && (await bcrypt.compare(password, user.hashed_password))) {
        res.json({
          user_id: user.user_id,
          user_name: user.user_name,
          user_email: user.user_email,
          role: user.role,
          token: generateToken(user.user_id, user.role),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { registerUser, loginUser };
