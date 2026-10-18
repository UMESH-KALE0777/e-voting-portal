const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { loginStudent } = require('../controllers/authController');

// Rate limiter for student login: 15 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  }
});

router.post('/login', authLimiter, loginStudent);

module.exports = router;