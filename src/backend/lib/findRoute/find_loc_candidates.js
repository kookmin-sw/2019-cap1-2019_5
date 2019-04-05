let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

let locSchema = new mongoose.Schema({
    location: {},
    name: String
});

let locModel = mongoose.model('hotplaces', locSchema);

function findLocationCandidates() {
    locModel.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [126.9923903, 37.534533] }, $maxDistance: 1000 } } }, function (err, arr) {
        if (err)
            console.log(err)
        return arr
    })
}

module.exports = {
    findLocationCandidates
  };