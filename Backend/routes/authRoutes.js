const express = require('express');
const {register, login, getCurrentUser} = require('../controller/Auth');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);


module.exports = router;