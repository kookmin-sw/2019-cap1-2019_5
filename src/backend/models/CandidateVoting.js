const mongoose = require('mongoose');

const CandidateVotingSchema = new mongoose.Schema({
  ResultID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result',
    required: true,
    unique: false
  },
  location: {}
});

module.exports = mongoose.model('VotedLocs', CandidateVotingSchema);
