const express = require('express');
const router = express.Router();
const multer = require('multer');
const rateLimit = require('express-rate-limit');

// File filter to restrict uploads to safe image MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and WEBP images are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
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

// Rate limiter for admin login: 5 attempts per 15 minutes per IP
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many admin authorization attempts. Please try again after 15 minutes.'
  }
});

// Middleware to handle multer upload errors cleanly
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Image file size exceeds 2MB limit' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Public Admin Routes
router.post('/login', adminLoginLimiter, loginAdmin);

// Protected Admin Routes
router.post('/candidate', protectAdmin, handleUpload, addCandidate);
router.delete('/reset', protectAdmin, resetElection);
router.get('/candidate/:id/voters', protectAdmin, getVotersForCandidate);
router.get('/results', protectAdmin, getResults);

module.exports = router;