const mongoose = require('mongoose');

const CandidateLocsSchema = new mongoose.Schema({
  name: {type: String},
  location : {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    }
  }
});

module.exports = mongoose.model('CandidateLocs', CandidateLocsSchema);
