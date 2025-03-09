const express = require('express');
const {register, login, getCurrentUser} = require('../controller/Auth');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

