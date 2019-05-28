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
  location: {
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
  ratingByCrawling: Number,
  ratingByVoting: Number
});

locationSchema.index({ location: '2dsphere' });

// compile schema to model
let areaModel = mongoose.model('CandidateLocs', locationSchema);

//read JSONfile
let locationCandidates = JSON.parse(fs.readFileSync('location_candidates.json', 'utf8'));

for (let i = 0; i < locationCandidates.length; i++) {

  let location = new areaModel({
    location: locationCandidates[i].location,
    name: locationCandidates[i].name,
    // 크롤링을 통한 평점 : 크롤링을 통해 나온 candidate.json 파일에서 추출됨
    ratingByCrawling: locationCandidates[i].ratingByCrawling,
    ratingByVoting: locationCandidates[i].ratingByVoting
  })
  location.save().then(result => {
    console.log(result);
  });
};
