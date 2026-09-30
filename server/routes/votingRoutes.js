const express = require('express');
const router = express.Router();
const { getBallot, submitVote } = require('../controllers/votingController');
const { protect } = require('../middleware/authMiddleware'); // Ensure this matches your actual auth middleware filename

// Protected Student Routes
router.get('/ballot', protect, getBallot);
router.post('/submit', protect, submitVote);

module.exports = router;