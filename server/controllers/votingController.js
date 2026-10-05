const Student = require('../models/Student');
const Candidate = require('../models/Candidate');

// @desc    Get ballot / candidates
// @route   GET /api/voting/ballot
// @access  Private
const getBallot = async (req, res) => {
  try {
    // 1. Standardize the voter's data to prevent mismatch errors (e.g., 'A ' vs 'A')
    const voterYear = Number(req.user.year);
    const voterSection = (req.user.section || '').trim().toUpperCase();

    // 2. Fetch candidates using the $or operator
    const candidates = await Candidate.find({
      $or: [
        // DOOR 1: Universal Roles
        // This makes the GS visible to all years (2nd, 3rd, 4th) and all sections (A, B)
        // The 'i' makes it case-insensitive so it catches 'GS', 'gs', 'General Secretary'
        { role: { $regex: /^(GS|General Secretary)$/i } },
        
        // DOOR 2: Cohort-Specific Roles (CR, LR, Cultural, Sports)
        // Matches the voter's year and either their specific section or a Combined cohort section
        { 
          year: voterYear, 
          section: { $regex: new RegExp(`^(${voterSection}|Combined)$`, 'i') }
        }
      ]
    });

    res.status(200).json({ success: true, count: candidates.length, data: candidates });
  } catch (error) {
    console.error('Error fetching ballot:', error);
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

    // 4. Lock the student's account AND record their choices
    student.hasVoted = true;
    student.votedFor = selectedCandidateIds;
    await student.save();

    res.status(200).json({ success: true, message: 'Vote successfully submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBallot,
  submitVote
}; 