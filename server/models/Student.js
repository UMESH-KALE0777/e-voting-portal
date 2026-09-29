const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    usn: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    // Add this field to track who they voted for
    votedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }]
});

module.exports = mongoose.model('Student', studentSchema);