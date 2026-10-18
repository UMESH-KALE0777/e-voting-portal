const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// @desc    Authenticate student by USN
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const rawUsn = req.body.usn;
    const rawYear = req.body.year;
    const rawSection = req.body.section;

    // 1. Strict Input Type Validation & Sanitization
    if (typeof rawUsn !== 'string' || !rawUsn.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid USN' });
    }

    const usn = rawUsn.trim().toUpperCase();

    // Whitelist USN format: alphanumeric only, 5 to 20 characters
    if (!/^[A-Z0-9]{5,20}$/.test(usn)) {
      return res.status(400).json({ success: false, message: 'Invalid USN format' });
    }

    const year = Number(rawYear);
    if (!Number.isInteger(year) || year < 1 || year > 4) {
      return res.status(400).json({ success: false, message: 'Year must be an integer between 1 and 4' });
    }

    if (typeof rawSection !== 'string' || !rawSection.trim()) {
      return res.status(400).json({ success: false, message: 'Please select a valid section' });
    }

    const section = rawSection.trim().toUpperCase();
    if (!/^[A-Z0-9]{1,10}$/.test(section)) {
      return res.status(400).json({ success: false, message: 'Invalid section format' });
    }

    // 2. Safe Database Query using sanitized string
    const student = await Student.findOne({ usn });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // 3. Verify year and section match the database record
    if (student.year !== year || student.section.toUpperCase() !== section) {
      return res.status(401).json({ success: false, message: 'Invalid year or section for this USN' });
    }

    if (student.hasVoted) {
      return res.status(403).json({ success: false, message: 'This USN has already cast a vote' });
    }

    // 4. Generate JWT payload with 30-minute expiration for voting portal security
    const token = jwt.sign(
      {
        id: student._id.toString(),
        usn: student.usn,
        year: student.year,
        section: student.section,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.status(200).json({
      success: true,
      token,
      student: {
        usn: student.usn,
        name: student.name,
        year: student.year,
        section: student.section,
        hasVoted: student.hasVoted,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login error', error: error.message });
  }
};

module.exports = { loginStudent };