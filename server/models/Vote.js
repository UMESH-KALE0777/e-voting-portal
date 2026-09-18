// server/models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Voter reference is required"],
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "Candidate reference is required"],
    },

    constituency: {
      type: String,
      required: [true, "Constituency is required"],
      trim: true,
    },

    voteHash: {
      type: String,
      required: [true, "Vote hash is required"],
      
      unique: true,
    },
  },
  { timestamps: true }
);

voteSchema.index({ voter: 1 }, { unique: true });  

 
voteSchema.index({ candidate: 1 });

 
voteSchema.index({ constituency: 1 });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;