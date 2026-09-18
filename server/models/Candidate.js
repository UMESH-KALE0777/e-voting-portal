const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL or image path
    required: true,
  },
  year: {
    type: Number,
    required: true,
    enum: [2, 3, 4],
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'Combined'],
  },
  role: {
    type: String,
    required: true,
    enum: ['GS', 'CR', 'LR', 'Cultural', 'Sports', 'Magazine'],
  },
  voteCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);