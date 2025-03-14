const jwt = require('jsonwebtoken');
const {pool} = require('../config/database');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]; 

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const result = await pool.query(
                'SELECT id, email, user_name, role FROM users WHERE id=$1',
                [decoded.id]
            );

            req.user = result.rows[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({message:'Not authorized, token failed'});
        }
    }
        if (!token) {
            res.status(401).json({message:'Not authorized, no token'});
        }
}

module.exports = protect;