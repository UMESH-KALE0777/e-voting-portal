const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  year: { type: Number, required: true },
  section: { type: String, required: true },
  voteCount: { type: Number, default: 0 },
  image: { type: String } // <-- Add this line to accept the Base64 image string
});

module.exports = mongoose.model('Candidate', candidateSchema);