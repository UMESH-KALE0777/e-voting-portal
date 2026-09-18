// server/models/Election.js
import mongoose from "mongoose";

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Election title is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: {
        values: ["Lok Sabha", "Assembly", "Municipal"],
        message: "Type must be Lok Sabha, Assembly, or Municipal",
      },
      required: [true, "Election type is required"],
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    
    constituency: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

electionSchema.virtual("status").get(function () {
  const now = new Date();
  if (now < this.startDate) return "upcoming";
  if (now > this.endDate)   return "ended";
  return "live";
});

 
electionSchema.pre("save", function () {
  if (this.endDate <= this.startDate) {
    throw new Error("endDate must be after startDate");
  }
});

electionSchema.index({ isActive: 1 });
electionSchema.index({ startDate: 1, endDate: 1 });

const Election = mongoose.model("Election", electionSchema);
export default Election;