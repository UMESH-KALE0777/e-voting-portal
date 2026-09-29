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

// @desc    Add a Candidate (with Image)
// @route   POST /api/admin/candidate
const addCandidate = async (req, res) => {
    try {
        const { name, role, year, section } = req.body;
        let imageBase64 = null;

        // Convert the uploaded file buffer into a Base64 string for MongoDB storage
        if (req.file) {
            imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        const candidate = await Candidate.create({
            name,
            role,
            year,
            section,
            image: imageBase64 // Store the encoded image string
        });

        res.status(201).json({ success: true, data: candidate });
    } catch (error) {
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

module.exports = { loginAdmin, addCandidate, resetElection, getVotersForCandidate };