const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Import middleware directly
const protectAdmin = require('../middleware/adminAuth');

// Destructure controllers
const { 
  loginAdmin, 
  addCandidate, 
  resetElection, 
  getVotersForCandidate,
  getResults 
} = require('../controllers/adminController');

// Public Admin Routes
router.post('/login', loginAdmin);

// Protected Admin Routes
router.post('/candidate', protectAdmin, upload.single('image'), addCandidate);
router.delete('/reset', protectAdmin, resetElection);
router.get('/candidate/:id/voters', protectAdmin, getVotersForCandidate);
router.get('/results', protectAdmin, getResults);

module.exports = router;