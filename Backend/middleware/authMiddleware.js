const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split('')[1];
        }
        if (!token) {
            return res.status(401).json({message:'Not authorized, no token'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userResult = await pool.query(
            'SELECT user_id, role FROM users WHERE user_id =$1',
            [decoded.id]
        );

        if(userResult.rows.length === 0) {
            return res.status(401).json({message: 'User no longer exists'});
        }
        req.user = {
            id: userResult.rows[0].user_id,
            role: userResult.rows[0].role
        };
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({message:'Not authorized, token failed'});
    }
};