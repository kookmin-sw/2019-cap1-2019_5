const express = require('express');
const router = express.Router();
const { makeMeeting } = require('../../lib/meeting/makeMeeting.js');
const makeMeetingUser = require('../../lib/meeting/makeMeetingUser.js');
const findMeetingData = require('../../lib/meeting/findMeetingData.js');

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

  router.post('/enrolledUser', async (req, res) => {
    let token = req.query.token;
    let createdUser = await makeMeetingUser(token, req.body.name, req.body.transportation,{coordinates: req.body.location, type: "Point"});
    res.json(createdUser);
  });

  router.get('/findMeeting', async (req, res) => {
    let token = req.query.token;
    let meetingData = await findMeetingData(token);

    res.json(meetingData);
  });

  return router;
};
