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

const findLocationCandidates = async (midLongitude, midLatitude) => {
    let candidates;
    await locModel.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [midLongitude, midLatitude]
                },
                $maxDistance: 3000
            }
        }
    }).then((res) => {
        candidates = res;
    }).catch((err) => {
        console.log(err);
    });
    return candidates;
};

module.exports = {
    findLocationCandidates
};