const db = require('../../models')
const express = require('express');
const router = express.Router();

module.exports = () => {
  router.use((req, res, next) => {
    next();
  });
  
  router.post('/makeVoting', async (req, res) => {
    let clientToken = req.query.token;
    let locIndex = req.body.index;
    let meeting = await db.Meeting.findOne({token : clientToken})

    let resultData = await db.Result.findOne({meetingID : meeting._id})
    let resultid = resultData._id;

    let votingData = new db.VotedLocs({
      ResultID: resultid,
      location: resultData.areas[locIndex].name
    });
    
    let resultValue;
    await votingData.save().then(result => {
      resultValue = result;
    });
    res.send(resultValue);
  });

  return router;
};
