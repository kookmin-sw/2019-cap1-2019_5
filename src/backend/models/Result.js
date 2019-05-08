const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  areas : {
    type: Array
  },
  meetingID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meetings',
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Result', resultSchema)
