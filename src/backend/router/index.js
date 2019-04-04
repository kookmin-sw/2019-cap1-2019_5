const express = require('express');
const router = express.Router();

module.exports = (passport) => {
  const version = 'v1';
  const findRouteRouter = require('./' + version + '/findRoute')();

  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  router.use('/' + version + '/findRoute', findRouteRouter);

  return router;
};
