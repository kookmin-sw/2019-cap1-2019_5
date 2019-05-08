const express = require('express');
const router = express.Router();
const public = require('../../lib/findRoute/byPublic.js');
const driving = require('../../lib/findRoute/byDriving.js');
const direction = require('../../location_candidates.json');
const locationCandidates = require('../../lib/findRoute/find_loc_candidates.js');

module.exports = () => {
  router.use((req, res, next) => {
    next();
  });

  router.all('/', (req, res) => {
    res.send("Hello World");
  });

  router.post('/findLoc', async (req, res) => {
    let output = {
      'areas': []
    };
    let middle = {
      'lat': 0,
      'lng': 0
    };

    // 중간위치 계산
    for (let i = 0; i < req.body.startLocs.length; i++) {
      middle.lat += parseFloat(req.body.startLocs[i].location.lat);
      middle.lng += parseFloat(req.body.startLocs[i].location.lng);
    }
    middle.lat /= req.body.startLocs.length;
    middle.lng /= req.body.startLocs.length;

    let locCandidates = await locationCandidates.findLocationCandidates(middle.lng, middle.lat);
    for (let i = 0; i < locCandidates.length; i++) {
      let area = {};
      area['name'] = locCandidates[i].name;
      area['location'] = locCandidates[i].location;
      area['average'] = {};

      // user들 각각 계산
      let groupTravelInfo = [];
      for (let j = 0; j < req.body.startLocs.length; j++) {
        let userTravelInfo;
        if (req.body.startLocs[j].transportation == 'public') {
          userTravelInfo = await public.shortestPath(req.body.startLocs[j].location.lng, req.body.startLocs[j].location.lat, locCandidates[i].location.coordinates[0], locCandidates[i].location.coordinates[1]);
        } else {
          userTravelInfo = await driving.shortestPath(req.body.startLocs[j].location.lng, req.body.startLocs[j].location.lat, locCandidates[i].location.coordinates[0], locCandidates[i].location.coordinates[1]);
        }
        groupTravelInfo.push(userTravelInfo);
      }
      area['users'] = groupTravelInfo;

      let midAvgDuration = 0;
      let midAvgDistance = 0;
      for (let j = 0; j < groupTravelInfo.length; ++j) {
        midAvgDuration += parseInt(groupTravelInfo[j].duration);
        midAvgDistance += parseInt(groupTravelInfo[j].distance);
      }
      midAvgDuration = parseInt(midAvgDuration / groupTravelInfo.length);
      midAvgDistance = parseInt(midAvgDistance / groupTravelInfo.length);
      area.average.avgDuration = midAvgDuration;
      area.average.avgDistance = midAvgDistance;

      let durationStdDeviation = 0;
      let distanceStdDeviation = 0;
      for (let j = 0; j < groupTravelInfo.length; ++j) {
        durationStdDeviation += Math.pow(groupTravelInfo[j].duration - midAvgDuration, 2);
        distanceStdDeviation += Math.pow(groupTravelInfo[j].distance - midAvgDistance, 2);
      }
      distanceStdDeviation = Math.sqrt(distanceStdDeviation / groupTravelInfo.length);
      durationStdDeviation = Math.sqrt(durationStdDeviation / groupTravelInfo.length);
      area.average.distanceStdDeviation = distanceStdDeviation;
      area.average.durationStdDeviation = durationStdDeviation;

      output.areas.push(area);
    }

    //TODO (Taeyoung): Get sortOption from Request Body
    //TODO (Taeyoung): Separate this sorting algorithm as a module.
    //sortOption : 0 (average distance, DEFAULT), 1 (average duration), 2 (distance standard deviation), 3 (duration standard deviation)
    let sortOption = 3;
    if (sortOption == 0) {
      output.areas.sort(function sortByAvgDistance(candidate1, candidate2) {
        if (candidate1.average.avgDistance == candidate2.average.avgDistance) {
          return 0;
        } else {
          return candidate1.average.avgDistance > candidate2.average.avgDistance ? 1 : -1;
        }
      });
    } else if (sortOption == 1) {
      output.areas.sort(function sortByAvgDuration(candidate1, candidate2) {
        if (candidate1.average.avgDuration == candidate2.average.avgDuration) {
          return 0;
        } else {
          return candidate1.average.avgDuration > candidate2.average.avgDuration ? 1 : -1;
        }
      });
    } else if (sortOption == 2) {
      output.areas.sort(function sortBydistanceStdDeviation(candidate1, candidate2) {
        if (candidate1.average.distanceStdDeviation == candidate2.average.distanceStdDeviation) {
          return 0;
        } else {
          return candidate1.average.distanceStdDeviation > candidate2.average.distanceStdDeviation ? 1 : -1;
        }
      });
    } else if (sortOption == 3) {
      output.areas.sort(function sortBydurationStdDeviation(candidate1, candidate2) {
        if (candidate1.average.durationStdDeviation == candidate2.average.durationStdDeviation) {
          return 0;
        } else {
          return candidate1.average.durationStdDeviation > candidate2.average.durationStdDeviation ? 1 : -1;
        }
      });
    };
    res.json(output);
  });
  return router;
};
