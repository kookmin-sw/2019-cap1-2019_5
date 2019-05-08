const mongoose = require('mongoose')

const meetingUserSchema = new mongoose.Schema({
  name : {
    type: String,
    default: "?"
  },
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
  meetingID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meetings',
    required: true
  }
});

module.exports = mongoose.model('MeetingUser', meetingUserSchema)
