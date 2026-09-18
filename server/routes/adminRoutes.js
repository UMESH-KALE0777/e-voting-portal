// server/routes/adminRoutes.js
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ─── GET all voters ───────────────────────────────────────────
router.get("/voters", protect, adminOnly, async (req, res) => {
  try {
    const voters = await User.find({ role: "VOTER" }).select("-password");
    res.json(voters);
  } catch (err) {
    console.error("GET /admin/voters:", err);
    
    res.status(500).json({ message: "Failed to fetch voters." });
  }
});

// ─── GET dashboard stats ──────────────────────────────────────
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [totalVoters, totalVotes, totalCandidates, votedCount] =
      await Promise.all([
        User.countDocuments({ role: "VOTER" }),
        Vote.countDocuments(),
        Candidate.countDocuments(),
        User.countDocuments({ role: "VOTER", hasVoted: true }),
      ]);

    res.json({
      totalVoters,
      totalVotes,
      totalCandidates,
      votedCount,
      turnout:
        totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0,
    });
  } catch (err) {
    console.error("GET /admin/stats:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

 
router.post("/reset-votes", protect, adminOnly, async (req, res) => {
  try {
    if (req.body.confirm !== "RESET") {
      return res.status(400).json({
        message: 'Send { "confirm": "RESET" } in request body to confirm reset.',
      });
    }

    await Promise.all([
      Vote.deleteMany({}),
      User.updateMany({}, { hasVoted: false, votedCandidate: null }),
      Candidate.updateMany({}, { totalVotes: 0 }),
    ]);

    console.warn(`⚠️  All votes reset by admin: ${req.user._id}`);
    res.json({ message: "All votes reset successfully." });
  } catch (err) {
    console.error("POST /admin/reset-votes:", err);
    res.status(500).json({ message: "Failed to reset votes." });
  }
});

export default router;