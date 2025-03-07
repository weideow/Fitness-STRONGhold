const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

//registration purpose for new users
exports.register = async(req, res) => {
    const {username, email, password, role} = req.body;

    try {
        //check if user exists
        const userCheck = await pool.query (
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        
        if (userCheck.rows.length > 0) {
            return res.status(400).json({message:'User already exists'});
        }
        //check is role correct
        if (role !== 'trainer' && role !== 'trainee') {
            return res.status(400).json({ message: 'Invalid role' });
          }

          //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //insert new user into database
          const newUser = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role',
            [username, email, hashedPassword, role]
          );

            //generat jwt token for new user
          const token = jwt.sign(
            {id: newUser.rows[0].user_id, role: newUser[0].role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
          );

          res.status(201).json({
            user: {
                id:newUser.rows[0].user_id,
                username: newUser.rows[0].username,
                email: newUser[0].email,
                role: newUser.rows[0].role
            },
            token
          });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({message:'Server error during registration'});
    }

};

// login for existing users
exports.login = async (req,res) => {
    const {email, password} = req.body;


    try {

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({message:'Invalid credentials'});
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role},
            process.env.JTW_SECRET,
            {expiresIn: '7d'}
        );

        res.json({
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
      
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Server error during login'});
    }

};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT user_id, username, email, role FROM users WHERE user_id = $1',
            [req.user.id]
        );

        if(user.rows.length === 0) {
            return res.status(404).json({message:'User not found'});
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({message:'Server error'});
    }
};
