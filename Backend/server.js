const dotenv = require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {connectDB} = require('./config/database');

const methodOverride = require('method-override');
const morgan = require('morgan');



const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

//middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/workouts', workoutRoutes);



app.listen(3000, () => {
  console.log('Listening on port 3000');
});

