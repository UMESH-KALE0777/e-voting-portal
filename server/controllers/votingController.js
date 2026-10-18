const mongoose = require('mongoose');
const Student = require('../models/Student');
const Candidate = require('../models/Candidate');

// Helper to escape regex special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper to test if a candidate's role is universal (GS)
const isUniversalRole = (role) => {
  if (!role) return false;
  return /^(GS|General Secretary)$/i.test(role.trim());
};

// @desc    Get ballot / candidates
// @route   GET /api/voting/ballot
// @access  Private
const getBallot = async (req, res) => {
  try {
    const voterYear = Number(req.user.year);
    const voterSection = typeof req.user.section === 'string'
      ? req.user.section.trim().toUpperCase()
      : '';

    if (!Number.isInteger(voterYear) || !voterSection) {
      return res.status(400).json({ success: false, message: 'Invalid voter profile data in token' });
    }

    const escapedSection = escapeRegex(voterSection);

    // Fetch candidates: Universal roles (GS) OR cohort-specific matching year & section
    const candidates = await Candidate.find({
      $or: [
        { role: { $regex: /^(GS|General Secretary)$/i } },
        {
          year: voterYear,
          section: { $regex: new RegExp(`^(${escapedSection}|Combined)$`, 'i') }
        }
      ]
    }).select('name role year section voteCount image');

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

    // 1. Strict Input Validation
    if (!Array.isArray(selectedCandidateIds) || selectedCandidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one candidate before submitting.'
      });
    }

    // Deduplicate candidate IDs
    const uniqueCandidateIds = [...new Set(selectedCandidateIds)];

    // Validate that every ID is a valid MongoDB ObjectId
    const allValidObjectIds = uniqueCandidateIds.every(
      (id) => typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)
    );

    if (!allValidObjectIds) {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate selection payload.'
      });
    }

    // 2. Fetch candidate documents to verify eligibility & role uniqueness
    const candidates = await Candidate.find({ _id: { $in: uniqueCandidateIds } });

    if (candidates.length !== uniqueCandidateIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected candidates could not be found.'
      });
    }

    const voterYear = Number(req.user.year);
    const voterSection = (req.user.section || '').trim().toUpperCase();

    // Verify each candidate is in this voter's eligible ballot
    const rolesSeen = new Set();
    for (const cand of candidates) {
      const isUniversal = isUniversalRole(cand.role);
      const matchesCohort =
        cand.year === voterYear &&
        (cand.section.toUpperCase() === voterSection || cand.section.toUpperCase() === 'COMBINED');

      if (!isUniversal && !matchesCohort) {
        return res.status(403).json({
          success: false,
          message: `Ineligible candidate selected: ${cand.name} (${cand.role})`
        });
      }

      // Enforce at most 1 vote per role
      const normalizedRole = cand.role.trim().toUpperCase();
      if (rolesSeen.has(normalizedRole)) {
        return res.status(400).json({
          success: false,
          message: `Multiple votes detected for role: ${cand.role}. Only one candidate per role is permitted.`
        });
      }
      rolesSeen.add(normalizedRole);
    }

    // 3. ATOMIC LOCK: Transition student hasVoted from false -> true
    // This single atomic operation guarantees prevention of race condition double-voting
    const lockedStudent = await Student.findOneAndUpdate(
      { _id: req.user.id, hasVoted: false },
      {
        $set: {
          hasVoted: true,
          votedFor: uniqueCandidateIds
        }
      },
      { new: true }
    );

    if (!lockedStudent) {
      return res.status(403).json({
        success: false,
        message: 'Vote rejected. You have already cast your ballot or account is locked.'
      });
    }

    // 4. Atomically increment vote counts for selected candidates
    await Candidate.updateMany(
      { _id: { $in: uniqueCandidateIds } },
      { $inc: { voteCount: 1 } }
    );

    res.status(200).json({ success: true, message: 'Vote successfully submitted' });
  } catch (error) {
    console.error('Submit vote error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBallot,
  submitVote
};