const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getBallot, submitVote } = require('../controllers/votingController');
const { getResults } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiter for ballot submission: max 5 requests per minute per IP
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many ballot submission attempts. Please wait a moment.'
  }
});

// Protected Student Routes
router.get('/ballot', protect, getBallot);
router.post('/submit', protect, submitLimiter, submitVote);
router.get('/results', protect, getResults);

module.exports = router;