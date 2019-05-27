//To connect DB , must excute mongodb
let fs = require("fs");
const db = require('./models');

await models.connectDB().then(async () => {
  console.log("good");
});

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
  rating: {
    type: Number,
    default: 1
  },
});

locationSchema.index({location: '2dsphere'});

// compile schema to model
let areaModel = mongoose.model('testLocs', locationSchema);

//read JSONfile
let locationCandidates = JSON.parse(fs.readFileSync('location_candidates.json', 'utf8'));

console.log(locationCandidates.length);
for(let i=0;i < locationCandidates.length; i++){
  // locationCandidates[i].rating = Math.random() * (2.0 - 0.0) + 0.0;
  // console.log((parseFloat(Math.random() * (2.0 - 0.0) + 0.0)).toFixed(2));
  locationCandidates[i].rating =(parseFloat(Math.random() * (2.0 - 0.0) + 0.0)).toFixed(2);
};

// insert data in db
areaModel.collection.insertMany(locationCandidates, function (err, r) {
  if (err) console.log(err)
  else db.close
});
