// server/controllers/candidateController.js
import Candidate from "../models/Candidate.js";
import { v2 as cloudinary } from "cloudinary";

// ─── GET ALL CANDIDATES ───────────────────────────────────────
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ constituency: 1, name: 1 });
    res.json(candidates);
  } catch (error) {
    console.error("getCandidates:", error);
    res.status(500).json({ message: "Failed to fetch candidates." });
  }
};

// ─── GET SINGLE CANDIDATE ─────────────────────────────────────
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }
    res.json(candidate);
  } catch (error) {
    console.error("getCandidateById:", error);
    res.status(500).json({ message: "Failed to fetch candidate." });
  }
};

// ─── ADD CANDIDATE (admin only) ───────────────────────────────
export const addCandidate = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { name, party, age, constituency, manifesto, education, experience } = req.body;

    if (!name || !party || !age || !constituency || !manifesto || !education || !experience) {
      // Delete uploaded Cloudinary image if validation fails
      if (req.file?.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({ message: "All candidate fields are required." });
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 25 || ageNum > 120) {
      if (req.file?.filename) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.status(400).json({ message: "Age must be between 25 and 120." });
    }

    
    const image = req.file ? req.file.path : "";

    const candidate = await Candidate.create({
      name:         name.trim(),
      party:        party.trim(),
      age:          ageNum,
      constituency: constituency.trim(),
      manifesto:    manifesto.trim(),
      education:    education.trim(),
      experience:   experience.trim(),
      image,
    });

    res.status(201).json(candidate);
  } catch (error) {
    if (req.file?.filename) {
      try { await cloudinary.uploader.destroy(req.file.filename); } catch {}
    }
    console.error("addCandidate:", error);
    res.status(500).json({ message: "Failed to add candidate." });
  }
};

// ─── DELETE CANDIDATE (admin only) ───────────────────────────
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    if (candidate.totalVotes > 0) {
      return res.status(400).json({
        message: `Cannot delete — ${candidate.totalVotes} vote(s) cast for this candidate. Reset votes first.`,
      });
    }

    // Delete image from Cloudinary using public_id extracted from URL
    if (candidate.image) {
      try {
        const urlParts = candidate.image.split("/");
        const publicId = urlParts.slice(-2).join("/").replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.warn("Could not delete Cloudinary image:", e.message);
      }
    }

    await candidate.deleteOne();
    res.json({ message: "Candidate deleted successfully." });

  } catch (error) {
    console.error("deleteCandidate:", error);
    res.status(500).json({ message: "Failed to delete candidate." });
  }
};