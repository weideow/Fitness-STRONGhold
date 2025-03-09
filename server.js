const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const methodOverride = require('method-override');
const morgan = require('morgan');


const app = express();

app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(morgan("dev"));




app.listen(3000, () => {
  console.log('Listening on port 3000');
});

