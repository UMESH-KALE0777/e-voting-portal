const Candidate = require('../models/Candidate');
const Student = require('../models/Student');

// @desc    Get eligible candidate ballot for logged-in student
// @route   GET /api/voting/ballot
// @access  Private
const getBallot = async (req, res) => {
    try {
        const { year, section } = req.user;

        // Fetch candidates matching voter's cohort + General Secretary (GS) candidates
        const candidates = await Candidate.find({
            $or: [
                { year: year, section: section },
                { role: 'GS' }
            ]
        });

        res.status(200).json({ success: true, count: candidates.length, data: candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching ballot', error: error.message });
    }
};

// @desc    Submit student vote
// @route   POST /api/voting/submit
// @access  Private
const submitVote = async (req, res) => {
    try {
        const { usn } = req.user;
        const { selectedCandidateIds } = req.body; // Array of candidate IDs

        if (!selectedCandidateIds || !Array.isArray(selectedCandidateIds) || selectedCandidateIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No candidates selected' });
        }

        // Check if student exists and has already voted
        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student record not found' });
        }

        if (student.hasVoted) {
            return res.status(403).json({ success: false, message: 'You have already cast your vote' });
        }

        // Increment vote count for selected candidates
        await Candidate.updateMany(
            { _id: { $in: selectedCandidateIds } },
            { $inc: { voteCount: 1 } }
        );

        // Mark student as voted
        student.hasVoted = true;
        await student.save();

        res.status(200).json({ success: true, message: 'Vote submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error submitting vote', error: error.message });
    }
};

// @desc    Get election results
// @route   GET /api/voting/results
// @access  Public (or Admin)
const getResults = async (req, res) => {
  try {
    // Fetch all candidates and sort them by voteCount in descending order
    const candidates = await Candidate.find({}).sort({ voteCount: -1 });
    res.status(200).json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching results', error: error.message });
  }
};

module.exports = {
  getBallot,
  submitVote,
  getResults
};