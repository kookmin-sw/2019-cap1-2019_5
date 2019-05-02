const mongoose = require('mongoose');

const CandidateLocsSchema = new mongoose.Schema({
  name: {type: String},
  location: {}
});

module.exports = mongoose.model('CandidateLocs', CandidateLocsSchema);
