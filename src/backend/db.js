//To connect DB , must excute mongodb
let fs = require("fs");
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

//define schema
let locationSchema = new mongoose.Schema({
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
  name: String
});

locationSchema.index({location: '2dsphere'});

// compile schema to model
let areaModel = mongoose.model('CandidateLocs', locationSchema);

//read JSONfile
let locationCandidates = JSON.parse(fs.readFileSync('location_candidates.json', 'utf8'));

// insert data in db
areaModel.collection.insertMany(locationCandidates, function (err, r) {
  if (err) console.log(err)
  else db.close
});
