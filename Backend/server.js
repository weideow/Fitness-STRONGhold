const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {connectDB} = require('./config/database');
const methodOverride = require('method-override');
const morgan = require('morgan');

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

connectDB(`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const registerRoutes = require('./routes/registerRoutes');

app.use('/register', registerRoutes)
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/workouts', workoutRoutes);


app.get('/', (req, res) => {
  res.send('Fitness API is running');
});



app.listen(3000, () => {
  console.log('Listening on port 3000');
});

