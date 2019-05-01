const express = require('express');
const router = express.Router();
const config = require('../config/server_config.json');
const version = config.version;

module.exports = () => {
  const findRouteRouter = require('./' + version + '/findRoute')();
  const meetingRouter = require('./' + version + '/meeting')();

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  router.use('/' + version + '/findRoute', findRouteRouter);
  router.use('/' + version + '/meeting', meetingRouter);

  return router;
};
