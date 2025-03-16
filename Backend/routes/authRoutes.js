const express = require('express');
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const {loginUser} = require('../controllers/Auth');

const router = express.Router();

router.post('/login', loginUser);

module.exports = router;