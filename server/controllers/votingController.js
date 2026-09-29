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
    student.votedFor = selectedCandidateIds; // <-- This is the required line you missed
    await student.save();

    res.status(200).json({ success: true, message: 'Vote successfully submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 