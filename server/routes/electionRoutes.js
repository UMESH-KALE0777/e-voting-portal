// server/routes/electionRoutes.js
import express from "express";
import mongoose from "mongoose";
import Election from "../models/Election.js";
import Vote from "../models/Vote.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

 
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Election not found." });
  }
  next();
};

// ─── GET active election (public) ────────────────────────────
router.get("/active", async (req, res) => {
  try {
    const election = await Election.findOne({ isActive: true });
    
    res.json(election || null);
  } catch (err) {
    console.error("GET /election/active:", err);
    res.status(500).json({ message: "Failed to fetch active election." });
  }
});

// ─── GET all elections (admin) ────────────────────────────────
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (err) {
    console.error("GET /election:", err);
    res.status(500).json({ message: "Failed to fetch elections." });
  }
});

// ─── CREATE election (admin) ──────────────────────────────────
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, startDate, endDate, constituency, state, type } = req.body;

    
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: "title, startDate and endDate are required." });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "startDate must be before endDate." });
    }

     
    await Election.updateMany({}, { isActive: false });

    const election = await Election.create({
      title,
      startDate,
      endDate,
      constituency,
      state,
      type,
      isActive: true, 
    });

    res.status(201).json(election);
  } catch (err) {
    console.error("POST /election:", err);
    res.status(500).json({ message: "Failed to create election." });
  }
});

// ─── UPDATE election (admin) ──────────────────────────────────
router.put("/:id", protect, adminOnly, validateObjectId, async (req, res) => {
  try {
 
    const { title, startDate, endDate, constituency, state, type, isActive } =
      req.body;

    const updates = {};
    if (title       !== undefined) updates.title        = title;
    if (startDate   !== undefined) updates.startDate    = startDate;
    if (endDate     !== undefined) updates.endDate      = endDate;
    if (constituency !== undefined) updates.constituency = constituency;
    if (state       !== undefined) updates.state        = state;
    if (type        !== undefined) updates.type         = type;
    if (isActive    !== undefined) updates.isActive     = isActive;

    const election = await Election.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

    res.json(election);
  } catch (err) {
    console.error("PUT /election/:id:", err);
    res.status(500).json({ message: "Failed to update election." });
  }
});

// ─── DELETE election (admin) ──────────────────────────────────
router.delete("/:id", protect, adminOnly, validateObjectId, async (req, res) => {
  try {
 
    const voteCount = await Vote.countDocuments({ election: req.params.id });
    if (voteCount > 0) {
      return res.status(400).json({
        message: `Cannot delete — ${voteCount} vote(s) have already been cast. Reset votes first.`,
      });
    }

    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

    res.json({ message: "Election deleted successfully." });
  } catch (err) {
    console.error("DELETE /election/:id:", err);
    res.status(500).json({ message: "Failed to delete election." });
  }
});

export default router;