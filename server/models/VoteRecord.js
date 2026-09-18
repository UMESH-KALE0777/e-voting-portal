const mongoose = require('mongoose');

const voteRecordSchema = new mongoose.Schema({
    studentUsn: {
        type: String,
        required: true,
        unique: true,
    },
    votedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('VoteRecord', voteRecordSchema);