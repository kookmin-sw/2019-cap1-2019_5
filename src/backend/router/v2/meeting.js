const express = require('express');
const router = express.Router();
const { makeMeeting } = require('../../lib/meeting/makeMeeting.js');
const makeMeetingUser = require('../../lib/meeting/makeMeetingUser.js');

module.exports = () => {
  router.use((req, res, next) => {
    next();
  });

  router.post('/test', async (req, res) => {
    res.send("for test router")
  });

  router.post('/makeMeeting', async (req, res) => {
    res.json(await makeMeeting(req.body.name, req.body.num));
  });

  router.post('/meetingUser', async (req, res) => {
    let token = req.query.token;
    let makedUser = await makeMeetingUser(token, req.body.name, {coordinates: req.body.location, type: "Point"});
    res.json(makedUser);
  });

  return router;
};
