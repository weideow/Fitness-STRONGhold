const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded); 
      
      
      const result = await pool.query(
        'SELECT user_id, email, user_name, role FROM users WHERE user_id = $1',
        [decoded.id]
      );

      
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error(error);
      
      // Handle token expired case
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;