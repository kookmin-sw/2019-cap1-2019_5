const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
  name : {type: String, default: "?"},
  users : {},
  number : {type: Number, default:0},
  token : {type:String},
  users : [{
    type: mongoose.Schema.Types.ObjectId, ref: 'MeetingUsers'
  }]
})

meetingSchema.pre('remove', (next) => {
  this.model('MeetingUsers').deleteMany({ meetingID: this._id }, next);
});

module.exports = mongoose.model('Meeting', meetingSchema)
