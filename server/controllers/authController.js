const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// @desc    Authenticate student by USN
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { section } = req.body;
    const usn = req.body.usn ? req.body.usn.trim().toUpperCase() : req.body.usn;
    // Normalize year if numeric string to support both numeric and string payloads
    const year = req.body.year !== undefined && !isNaN(req.body.year) && typeof req.body.year !== 'boolean'
      ? Number(req.body.year)
      : req.body.year;

    if (!usn) {
      return res.status(400).json({ success: false, message: 'Please provide a valid USN' });
    }

    // 1. Find the student by USN
    const student = await Student.findOne({ usn });

    // 2. Check if student exists
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // 3. NEW: Verify year and section match the database record
    if (student.year !== year || student.section !== section) {
      return res.status(401).json({ success: false, message: 'Invalid year or section for this USN' });
    }

    if (student.hasVoted) {
      return res.status(403).json({ success: false, message: 'This USN has already cast a vote' });
    }

    // Generate JWT payload with cohort data
    const token = jwt.sign(
      {
        id: student._id,
        usn: student.usn,
        year: student.year,
        section: student.section,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
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
    res.status(500).json({ success: false, message: 'Login error', error: error.message });
  }
};

module.exports = { loginStudent };