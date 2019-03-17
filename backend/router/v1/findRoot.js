const express = require('express');
const router = express.Router();

const subway = require('../../lib/findRoot/bySubway.js');

module.exports = (passport) => {
  router.use((req, res, next) => {
    next();
  });

  router.all('/', (req, res) => {
    res.send("Hello World");
  });

  router.all('/test', (req, res) => {
    subway.shortestPath();

    res.json({
      msg: 'Hello World!'
    });
  });

  return router;
};
