// 임의로 rating을 넣는 함수입니다.

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
  name: String,
  rating: Number
});

locationSchema.index({location: '2dsphere'});

// compile schema to model
let areaModel = mongoose.model('CandidateLocs', locationSchema);

//read JSONfile
let locationCandidates = JSON.parse(fs.readFileSync('location_candidates.json', 'utf8'));

console.log(locationCandidates.length);
console.log(typeof locationCandidates[0]);
console.log(typeof locationCandidates[0].location.coordinates);
console.log(typeof locationCandidates[0].name);
console.log(locationCandidates[0].location);
let x = [];
for(let i=0;i < locationCandidates.length; i++){
  let test = new areaModel({
    location: locationCandidates[i].location,
    name: locationCandidates[i].name,
    rating: 1
  })
  // x.push(locationCandidates[i]);
  // locationCandidates[i].rating = Math.random() * (2.0 - 0.0) + 0.0;
  // console.log((parseFloat(Math.random() * (2.0 - 0.0) + 0.0)).toFixed(2));
  // locationCandidates[i].rating = parseFloat((Math.random() * (2.0 - 0.0) + 0.0).toFixed(2));
  // locationCandidates[i].rating = (Math.random() * (2.0 - 0.0) + 0.0).toFixed(2);
  // locationCandidates[i].rating = 2;
  // console.log(typeof locationCandidates[i].rating)

  test.save().then(result => {
    console.log(result);
  });
};

// insert data in db
// areaModel.collection.insertMany(locationCandidates, function (err, r) {
//   if (err) console.log(err)
//   else db.close
// });
