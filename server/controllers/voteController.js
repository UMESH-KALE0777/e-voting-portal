// server/controllers/voteController.js
import mongoose from "mongoose";
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import Election from "../models/Election.js";
import generateHash from "../utils/generateHash.js";

// ─── HELPER ───────────────────────────────────────────────────
const normalizeConstituency = (str) =>
  str?.toLowerCase().trim().replace(/\s+lok\s+sabha\s*$/i, "").replace(/\s+/g, " ").trim();

// ─── CAST VOTE ────────────────────────────────────────────────
export const castVote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "candidateId is required." });
    }

 
    const election = await Election.findOne({ isActive: true });

    if (!election) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No active election found." });
    }

    const now = new Date();

    if (now < election.startDate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Voting has not started yet. It opens on ${election.startDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.`,
      });
    }

    if (now > election.endDate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Voting has ended. It closed on ${election.endDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.`,
      });
    }

    // Re-fetch user within the transaction for fresh hasVoted state
    const user = await User.findById(req.user._id).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found." });
    }

    if (user.hasVoted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You have already voted." });
    }

    const candidate = await Candidate.findById(candidateId).session(session);
    if (!candidate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Candidate not found." });
    }

    
    if (normalizeConstituency(candidate.constituency) !== normalizeConstituency(user.constituency)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `You can only vote for candidates in your constituency: ${user.constituency}`,
      });
    }

    const voteHash = generateHash(`${user._id}-${candidate._id}-${Date.now()}`);

    
    await Vote.create([{
      voter: user._id,
      candidate: candidate._id,
      constituency: user.constituency,
      voteHash,
    }], { session });

    await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { totalVotes: 1 } },
      { session }
    );

    await User.findByIdAndUpdate(
      user._id,
      { hasVoted: true, votedCandidate: candidate._id },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Vote cast successfully." });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already voted." });
    }

    console.error("castVote error:", error);
    res.status(500).json({ message: "Failed to cast vote. Please try again." });
  }
};

// ─── GET MY VOTE ──────────────────────────────────────────────
export const getMyVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ voter: req.user._id })
      .populate("candidate", "name party constituency image totalVotes");

    if (!vote) {
      return res.status(404).json({ message: "You have not voted yet." });
    }

    res.json(vote);
  } catch (error) {
    console.error("getMyVote error:", error);
    res.status(500).json({ message: "Failed to fetch your vote." });
  }
};

// ─── GET VOTE STATS ───────────────────────────────────────────
export const getVoteStats = async (req, res) => {
  try {
    const [totalVotes, totalVoters, candidates] = await Promise.all([
      Vote.countDocuments(),
      User.countDocuments({ role: "VOTER" }),
      Candidate.find().sort({ totalVotes: -1 }),
    ]);

    // Party-wise results
    const partyMap = {};
    candidates.forEach((c) => {
      if (!partyMap[c.party]) {
        partyMap[c.party] = { party: c.party, votes: 0, candidates: [] };
      }
      partyMap[c.party].votes += c.totalVotes;
      partyMap[c.party].candidates.push({
        name: c.name,
        constituency: c.constituency,
        votes: c.totalVotes,
      });
    });

    // Constituency-wise results
    const constituencyMap = {};
    candidates.forEach((c) => {
      if (!constituencyMap[c.constituency]) {
        constituencyMap[c.constituency] = { constituency: c.constituency, candidates: [] };
      }
      constituencyMap[c.constituency].candidates.push({
        name: c.name, party: c.party, votes: c.totalVotes, image: c.image,
      });
    });

    res.json({
      totalVotes,
      totalVoters,
      turnout: totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0,
      partyWise: Object.values(partyMap).sort((a, b) => b.votes - a.votes),
      constituencyWise: Object.values(constituencyMap),
    });
  } catch (error) {
    console.error("getVoteStats error:", error);
    res.status(500).json({ message: "Failed to fetch vote statistics." });
  }
};