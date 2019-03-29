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

    for (var i = 0; i < direction.data.length; i++) {
      endX = direction.data[i].loc.longitude;
      endY = direction.data[i].loc.latitude;
      output[direction.data[i].name] = await subway.shortestPath(startX, startY, endX, endY);
    }

    res.json(output);
  });

  //TODO(Taeyoung): modify startX,Y
  router.get('/driving', async (req, res) => {
    let startLng = req.query.startLng;
    let startLat = req.query.startLat;
    let estimatedTime = {};

    for (let i = 0; i < direction.data.length; i++) {
      let endLng = direction.data[i].loc.longitude;
      let endLat = direction.data[i].loc.latitude;
      estimatedTime[i] = '해당위치에서 ' + direction.data[i].name + ' 까지의 소요시간은 ' + await driving.shortestPath(startLng, startLat, endLng, endLat) + '분 입니다.';
    }
    res.json(estimatedTime);
  });
  return router;
};
