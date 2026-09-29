const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// @desc    Authenticate student by USN
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { usn } = req.body;

    if (!usn) {
      return res.status(400).json({ success: false, message: 'Please provide a valid USN' });
    }

    // Standardize USN input to uppercase
    const formattedUsn = usn.trim().toUpperCase();

    // Find student in pre-loaded roster
    const student = await Student.findOne({ usn: formattedUsn });

    if (!student) {
      return res.status(404).json({ success: false, message: 'USN not registered in voter list' });
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