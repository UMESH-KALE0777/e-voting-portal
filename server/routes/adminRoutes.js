const express = require('express');
const router = express.Router();
const multer = require('multer');
const { loginAdmin, addCandidate, resetElection, getVotersForCandidate } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminAuth');
const { getResults } = require('../controllers/votingController');

// Configure Multer to store the file in memory (RAM) temporarily
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/login', loginAdmin);

// Protected Admin Routes
router.post('/candidate', protectAdmin, upload.single('image'), addCandidate);
router.delete('/reset', protectAdmin, resetElection);

// Route for fetching voter identities for a specific candidate
router.get('/candidate/:id/voters', protectAdmin, getVotersForCandidate);

// Move the Results route here, protected by Admin Auth
router.get('/results', protectAdmin, getResults);

module.exports = router;