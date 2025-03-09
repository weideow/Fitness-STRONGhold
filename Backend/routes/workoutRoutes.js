const express = require('express');
const {protect, authorize} = require('../middleware/authMiddleware');
const router = express.Router();

const {
    getWorkouts
}