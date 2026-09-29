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

// @desc    Submit vote
// @route   POST /api/voting/submit
// @access  Private
const submitVote = async (req, res) => {
  try {
    const { selectedCandidateIds } = req.body;
    
    // 1. Fetch the fresh student record from the database
    const student = await Student.findById(req.user.id);

    // 2. SECURITY CHECK: Has the student already voted?
    if (student.hasVoted) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vote rejected. You have already cast your ballot.' 
      });
    }

    // 3. Process the votes
    for (const candidateId of selectedCandidateIds) {
      await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });
    }

    // 4. Lock the student's account from future voting
    student.hasVoted = true;
    await student.save();

    res.status(200).json({ success: true, message: 'Vote successfully submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
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