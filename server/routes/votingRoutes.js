const express = require('express');
const router = express.Router();
const { getBallot, submitVote, getResults } = require('../controllers/votingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/ballot', protect, getBallot);
router.post('/submit', protect, submitVote);

// New Results Route (Leaving unprotected for easy viewing, though you'd normally protect this)
router.get('/results', getResults);

module.exports = router;