const express = require('express');
const router = express.Router();
const subway = require('../../lib/findRoute/bySubway.js');
const driving = require('../../lib/findRoute/byDriving.js');
const direction = require('../../location_candidates.json');
const locationCandidates = require('../../lib/findRoute/find_loc_candidates.js')

module.exports = (passport) => {
  router.use((req, res, next) => {
    next();
  });

  router.all('/', (req, res) => {
    res.send("Hello World");
  });

  router.get('/transport', async (req, res) => {
    let startX, startY, endX, endY;
    let output = {};

    startX = req.query.startX;
    startY = req.query.startY;

    for (let i = 0; i < direction.data.length; i++) {
      endX = direction.data[i].loc.longitude;
      endY = direction.data[i].loc.latitude;
      output[direction.data[i].name] = await subway.shortestPath(startX, startY, endX, endY);
    }

    res.json(output);
  });

  router.get('/driving', async (req, res) => {
    let startLng = req.query.startLng;
    let startLat = req.query.startLat;
    let travelInfo = {};

    for (let i = 0; i < direction.data.length; i++) {
      let endLng = direction.data[i].loc.longitude;
      let endLat = direction.data[i].loc.latitude;
      travelInfo[direction.data[i].name] = await driving.shortestPath(startLng, startLat, endLng, endLat);
    }
    res.json(travelInfo);
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
          userTravelInfo = await subway.shortestPath(req.body.startLocs[j].location.lng, req.body.startLocs[j].location.lat, locCandidates[i].location.coordinates[0], locCandidates[i].location.coordinates[1]);
        } else {
          userTravelInfo = await driving.shortestPath(req.body.startLocs[j].location.lng, req.body.startLocs[j].location.lat, locCandidates[i].location.coordinates[0], locCandidates[i].location.coordinates[1]);
        }
        groupTravelInfo.push(userTravelInfo);
      }
      area['users'] = groupTravelInfo;

      let midAverageDuration = 0;
      let midAverageDistance = 0;
      for (let j = 0; j < groupTravelInfo.length; ++j) {
        midAverageDuration += parseInt(groupTravelInfo[j].duration);
        midAverageDistance += parseInt(groupTravelInfo[j].distance);
      }
      midAverageDuration = parseInt(midAverageDuration / groupTravelInfo.length);
      midAverageDistance = parseInt(midAverageDistance / groupTravelInfo.length);
      area.average.averageDuration = midAverageDuration;
      area.average.averageDistance = midAverageDistance;

      let sumDurationDeviation = 0;
      let sumDistanceDeviation = 0;
      for (let j = 0; j < groupTravelInfo.length; ++j) {
        sumDurationDeviation += Math.abs(midAverageDuration - groupTravelInfo[j].duration);
        sumDistanceDeviation += Math.abs(midAverageDistance - groupTravelInfo[j].distance);
      }
      let durationAverageAbsDeviation = parseInt(sumDurationDeviation / groupTravelInfo.length);
      let distanceAverageAbsDeviation = parseInt(sumDistanceDeviation / groupTravelInfo.length);
      area.average.durationAverageAbsDeviation = durationAverageAbsDeviation;
      area.average.distanceAverageAbsDeviation = distanceAverageAbsDeviation;

      output.areas.push(area);
    }
    //TODO (Taeyoung): Get sortOption from Request Body
    //TODO (Taeyoung): Separate this sorting algorithm as a module.
    //sortOption : 0 (average distance, DEFAULT), 1 (average duration), 2 (duration Ave Abs Deviation), 3 (distance Ave Abs Deviation)
    let sortOption = 3;
    if (sortOption == 0) {
      output.areas.sort(function sortByDistance(candidate1, candidate2) {
        if (candidate1.average.averageDistance == candidate2.average.averageDistance) {
          return 0;
        } else {
          return candidate1.average.averageDistance > candidate2.average.averageDistance ? 1 : -1;
        }
      });
    } else if (sortOption == 1) {
      output.areas.sort(function sortByDuration(candidate1, candidate2) {
        if (candidate1.average.averageDuration == candidate2.average.averageDuration) {
          return 0;
        } else {
          return candidate1.average.averageDuration > candidate2.average.averageDuration ? 1 : -1;
        }
      });
    } else if (sortOption == 2) {
      output.areas.sort(function sortByDurationAveAbsDev(candidate1, candidate2) {
        if (candidate1.average.durationAverageAbsDeviation == candidate2.average.durationAverageAbsDeviation) {
          return 0;
        } else {
          return candidate1.average.durationAverageAbsDeviation > candidate2.average.durationAverageAbsDeviation ? 1 : -1;
        }
      });
    } else {
      output.areas.sort(function sortByDistanceAveAbsDev(candidate1, candidate2) {
        if (candidate1.average.distanceAverageAbsDeviation == candidate2.average.distanceAverageAbsDeviation) {
          return 0;
        } else {
          return candidate1.average.distanceAverageAbsDeviation > candidate2.average.distanceAverageAbsDeviation ? 1 : -1;
        }
      });
    };
    res.json(output);
  });
  return router;
};