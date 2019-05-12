const db = require('../../models')
const express = require('express');
const router = express.Router();



module.exports = () => {
  router.use((req, res, next) => {
    next();
  });
  let votingResult = new Array();
  router.post('/makeVoting', async (req, res) => {
    // let clientToken = req.query.token; //토큰으로 받을경우
    // let locIndex = req.query.index;
    // let meeting = await db.Meeting.findOne({token : clientToken})

    let locIndex = 0;
    let meeting = await db.Meeting.findOne({name : "테스트"})
    let resultData = await db.Result.findOne({meetingID : meeting._id})
    let resultid = resultData._id;

    let votingData = new db.VotedLocs({
      ResultID: resultid,
      location: resultData.areas[locIndex].name
    });

    await votingData.save();
    
    for(let i = 0; i < resultData.areas.length ; i++)
    {
      votingResult[i] = await db.VotedLocs.find({ResultID : resultid,location : resultData.areas[i].name}).count();
    }

    res.send(votingResult)
  });

  return router;
};
