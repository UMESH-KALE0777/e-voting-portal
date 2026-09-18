// server/routes/candidateRoutes.js
import express from "express";
import mongoose from "mongoose";
import {
  getCandidates,
  getCandidateById,
  addCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

 
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: "Candidate not found." });
  }
  next();
};

 
router.get("/", getCandidates);
router.get("/:id", validateObjectId, getCandidateById);

// Admin only routes
router.post("/", protect, adminOnly, upload.single("image"), addCandidate);
router.delete("/:id", protect, adminOnly, validateObjectId, deleteCandidate);

export default router;