const express = require('express');
const router = express.Router();

module.exports = (passport) => {
  const version = 'v1';
  const findRouteRouter = require('./' + version + '/findRoute')();

  router.use((req, res, next) => {
    next();
  });

  router.use('/' + version + '/findRoute', findRouteRouter);

  return router;
};
