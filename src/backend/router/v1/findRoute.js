const express = require('express');
const router = express.Router();
const subway = require('../../lib/findRoute/bySubway.js');
const driving = require('../../lib/findRoute/byDriving.js');
const direction = require('../../exam.json');

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
      middle.lat += req.body.startLocs[i].location.lat;
      middle.lng += req.body.startLocs[i].location.lng;
    }
    middle.lat /= req.body.startLocs.length;
    middle.lng /= req.body.startLocs.length;

    // TODO(Choi, Taeyoung): database와 연결해서 중간위치와 가까운 추천장소 후보군 불러오기
    let placeCandidates = direction.data;

    for (let j = 0; j < placeCandidates.length; j++) {
      let area = {};
      area['name'] = placeCandidates[j].name;
      area['location'] = placeCandidates[j].loc;

      // user들 각각 계산
      let users = [];
      for (let k = 0; k < req.body.startLocs.length; k++) {
        let userTravelInfo;
        if (req.body.startLocs[k].transportation == 'public') {
          userTravelInfo = await subway.shortestPath(req.body.startLocs[k].location.lng, req.body.startLocs[k].location.lat, placeCandidates[j].loc.longitude, placeCandidates[j].loc.latitude);
        } else {
          userTravelInfo = await driving.shortestPath(req.body.startLocs[k].location.lng, req.body.startLocs[k].location.lat, placeCandidates[j].loc.longitude, placeCandidates[j].loc.latitude);
        }
        users.push(userTravelInfo);
      }
      area['users'] = users;
      output.areas.push(area);
    }
    res.json(output);
  });
  return router;
};
