const {Pool} = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    ssl: {
        rejectUnauthorized: true
      }
    });


const connectDB = async() => {
    try {
        await pool.connect();
        console.log('PostgreSQL connected');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

 module.exports = {pool, connectDB};