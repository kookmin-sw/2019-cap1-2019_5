const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
  name : {type: String, default: "?"},
  users : {},
  number : {type: Number, default:0},
  token : {type:String}
})

module.exports = mongoose.model('Meeting', meetingSchema)
