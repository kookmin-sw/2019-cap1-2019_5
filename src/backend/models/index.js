const mongoose = require('mongoose');
const Meeting = require('./Meeting.js');
const CandidateLocs = require('./CandidateLocs.js')

const connectDB = () => {
  console.log("connect with DB")
  return mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true });
};

const models = { Meeting, CandidateLocs };

module.exports = { connectDB, Meeting, CandidateLocs};
