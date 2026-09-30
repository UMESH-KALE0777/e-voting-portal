const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const Student = require('../models/Student');

// @desc    Admin Login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    // Temporarily hardcode for local Windows testing
    const expectedUser = "admin";
    const expectedPass = "supersecret123";

    if (username === expectedUser && password === expectedPass) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '4h' });
        res.status(200).json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
    }
};

const addCandidate = async (req, res) => {
  try {
    const { name, role, year, section } = req.body;

    // Safely parse image buffer to Base64 if uploaded
    let imageData = '';
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      imageData = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const candidate = new Candidate({
      name,
      role,
      year: Number(year), // Explicitly convert string from FormData to Number
      section,
      image: imageData
    });

    await candidate.save();
    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    console.error('Error in addCandidate:', error);
    res.status(500).json({ success: false, message: 'Failed to add candidate', error: error.message });
  }
};

// @desc    Clear Election Data (Factory Reset)
// @route   DELETE /api/admin/reset
const resetElection = async (req, res) => {
    try {
        // 1. Delete all candidates
        await Candidate.deleteMany({});

        // 2. Reset all students so they can vote again in the next election
        await Student.updateMany({}, { hasVoted: false });

        res.status(200).json({ success: true, message: 'Election data completely cleared. Ready for next election.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reset election', error: error.message });
    }
};

// @desc    Get all students who voted for a specific candidate
// @route   GET /api/admin/candidate/:id/voters
const getVotersForCandidate = async (req, res) => {
    try {
        const candidateId = req.params.id;

        // Find all students whose 'votedFor' array contains this candidate's ID
        // We use .select() to only return the necessary data, omitting sensitive info
        const voters = await Student.find({ votedFor: candidateId })
            .select('name usn year section')
            .sort({ usn: 1 }); // Sort alphabetically by USN

        res.status(200).json({
            success: true,
            count: voters.length,
            data: voters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch voters for this candidate',
            error: error.message
        });
    }
};

// @desc    Get election results
// @route   GET /api/admin/results
const getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ voteCount: -1 });
    res.status(200).json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch results', error: error.message });
  }
};

module.exports = {
  loginAdmin,
  addCandidate,
  resetElection,
  getVotersForCandidate,
  getResults
};