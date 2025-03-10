const dotenv = require('dotenv');
dotenv.config();
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

//routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));


app.listen(3000, () => {
  console.log('Listening on port 3000');
});

