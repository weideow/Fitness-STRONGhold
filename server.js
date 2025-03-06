const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const { Pool } = require('pg');

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(morgan("dev"));


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

