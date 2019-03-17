const express = require('express');
const router = express.Router();

module.exports = (passport) => {
  const version = 'v1';
  const findRootRouter = require('./' + version + '/findRoot')();

  router.use((req, res, next) => {
    next();
  });

  router.use('/' + version + '/findRoot', findRootRouter);

  return router;
};
