// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    voterId: {
      type: String,
      required: [true, "Voter ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    aadhaarNumber: {
      type: String,
      required: [true, "Aadhaar number is required"],
      unique: true,
      
    },

    constituency: {
      type: String,
      required: [true, "Constituency is required"],
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: ["VOTER", "ADMIN"],
        message: "Role must be VOTER or ADMIN",
      },
      default: "VOTER",
    },

    hasVoted: {
      type: Boolean,
      default: false,
    },

    votedCandidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ constituency: 1 });
userSchema.index({ role: 1, hasVoted: 1 });

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.aadhaarNumber;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;