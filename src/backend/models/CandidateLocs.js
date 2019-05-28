const mongoose = require('mongoose');

const CandidateLocsSchema = new mongoose.Schema({
  name: {type: String},
  location : {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  ratingByVoting : Number,
  ratingByCrawling : Number
});

module.exports = mongoose.model('CandidateLocs', CandidateLocsSchema);
