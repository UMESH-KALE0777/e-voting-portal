const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const Student = require('../models/Student');

// Constant-time string comparison to prevent timing attacks
const timingSafeStringEqual = (a, b) => {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

// @desc    Admin Login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const rawUsername = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const rawPassword = typeof req.body.password === 'string' ? req.body.password.trim() : '';

    const safeEnvUser = (process.env.ADMIN_USERNAME || '').trim();
    const safeEnvPass = (process.env.ADMIN_PASSWORD || '').trim();

    if (!safeEnvUser || !safeEnvPass) {
      return res.status(500).json({ success: false, message: 'Admin credentials not configured on server' });
    }

    const isUserMatch = timingSafeStringEqual(rawUsername, safeEnvUser);
    const isPassMatch = timingSafeStringEqual(rawPassword, safeEnvPass);

    if (isUserMatch && isPassMatch) {
      const token = jwt.sign(
        { id: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add Candidate
// @route   POST /api/admin/candidate
const addCandidate = async (req, res) => {
  try {
    const { name, role, year, section } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Candidate name is required' });
    }

    if (!role || typeof role !== 'string' || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Candidate role is required' });
    }

    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1 || yearNum > 4) {
      return res.status(400).json({ success: false, message: 'Valid year (1-4) is required' });
    }

    if (!section || typeof section !== 'string' || !section.trim()) {
      return res.status(400).json({ success: false, message: 'Valid section is required' });
    }

    // Safely parse image buffer to Base64 if uploaded
    let imageData = '';
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      imageData = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const candidate = new Candidate({
      name: name.trim(),
      role: role.trim(),
      year: yearNum,
      section: section.trim(),
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
    await Candidate.deleteMany({});
    await Student.updateMany({}, { hasVoted: false, votedFor: [] });

    res.status(200).json({ success: true, message: 'Election data completely cleared. Ready for next election.' });
  } catch (error) {
    console.error('Error in resetElection:', error);
    res.status(500).json({ success: false, message: 'Failed to reset election', error: error.message });
  }
};

// @desc    Get all students who voted for a specific candidate
// @route   GET /api/admin/candidate/:id/voters
const getVotersForCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ success: false, message: 'Invalid candidate ID' });
    }

    const voters = await Student.find({ votedFor: candidateId })
      .select('name usn year section')
      .sort({ usn: 1 });

    res.status(200).json({
      success: true,
      count: voters.length,
      data: voters
    });
  } catch (error) {
    console.error('Error in getVotersForCandidate:', error);
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
    console.error('Error in getResults:', error);
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