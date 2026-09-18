const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    usn: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    name: {
        type: String,
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
        enum: ['A', 'B', 'Combined'], // Combined for 4th Year single cohort
    },
    hasVoted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);