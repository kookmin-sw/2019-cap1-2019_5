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
      output[i] = '해당위치에서 ' + direction.data[i].name + ' 까지의 소요시간은 ' + await subway.shortestPath(startX, startY, endX, endY) + '분 입니다.';
    }
    res.json(output);
  });

  router.get('/driving', async (req, res) => {
    let startX = req.query.startX;
    let startY = req.query.startY;
    let estimatedTime = {};
    //TODO (Taeyoung) : get response, show ETA
    //res.json();
  });

  return router;
};
