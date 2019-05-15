const db = require('../../models');
const crypto = require('crypto');

module.exports = async (token) => {

  let meeting = await db.Meeting.findOne({
    token: token
  });

  let meetingUsers = await db.MeetingUser.find({
    meetingID: meeting._id,
  });

  let meetingData = {
    meeting: meeting,
    meetingUsers: meetingUsers
  };

  return meetingData;
};