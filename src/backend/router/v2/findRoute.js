const express = require('express');
const router = express.Router();
const candidatesWithUserData = require('../../lib/findRoute/candidatesWithUserData.js');
const db = require('../../models')

module.exports = () => {
  router.use((req, res, next) => {
    next();
  });

  router.post('/findLoc', async (req, res) => {

    let meetingData = await db.Meeting.findOne({
      token: req.query.token
    });

    // 1. token입력이 잘못된 경우 2. 이미 결과가 있는경우 3. 결과가 없어서 새로 만드는 경우
    if (meetingData == null) {
      res.json({
        msg: "잘못된 경로입니다."
      });
      return ;
    } else if (meetingData.result == true) {
      let result = await db.Result.findOne({
        meetingID: meetingData._id
      });
      res.json(result);
    } else {
      // TODO : 결과가 없으면서 현재까지 입력한 사람들의 데이터를 보내주는 경우 만들어야함.
      let userData = await db.MeetingUser.find({
        meetingID: meetingData._id
      });
      console.log(userData);

      let result = await candidatesWithUserData(userData);

      let resultColumn = new db.Result({
        areas: result.areas,
        meetingID: meetingData._id
      });

      await resultColumn.save();
      meetingData.result = true;
      await meetingData.save();

      res.json(result);
    }

  });

  return router;
};
