const express = require('express');
const router = express.Router();
const { makeMeeting } = require('../../lib/meeting/makeMeeting.js');

module.exports = () => {
  router.use((req, res, next) => {
    next();
  });

  router.post('/test', async (req, res) => {
    // res.send("test");
    let x = await makeMeeting("gooddddd?", 5);
    console.log(3, x);
    res.send(x);
  });

  router.post('/makeMeeting', async (req, res) => {
    res.json(await makeMeeting(req.body.name, req.body.num));
  });

  return router;
};
