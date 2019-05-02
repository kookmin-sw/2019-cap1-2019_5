const mongoose = require('mongoose');
const db = require('../../models');

const findLocationCandidates = async (midLongitude, midLatitude, maxDistance = 500) => {
    const MIN_CANDIDATES = 3;
    let candidates;
    await db.CandidateLocs.find({
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
