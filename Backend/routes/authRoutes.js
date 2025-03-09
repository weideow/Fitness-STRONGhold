const express = require('express');
const {register, login, getCurrentUser} = require('../controller/Auth');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

module.exports = router;