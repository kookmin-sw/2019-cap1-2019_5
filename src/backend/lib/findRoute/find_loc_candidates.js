let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!");
});

let locSchema = new mongoose.Schema({
    location: {},
    name: String
});

let locModel = mongoose.model('locations', locSchema);

const findLocationCandidates = async (midLongitude, midLatitude, maxDistance = 500) => {
    const MIN_CANDIDATES = 3;
    let candidates;
    await locModel.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [midLongitude, midLatitude]
                },
                $maxDistance: maxDistance
            }
        }
    }).then((res) => {
        if (res.length < MIN_CANDIDATES) {
            candidates = findLocationCandidates(midLongitude, midLatitude, maxDistance + 1000);
        }
        else {
            candidates = res;
        }
    }).catch((err) => {
        console.log(err);
    });
    return candidates;
};

module.exports = {
    findLocationCandidates
};