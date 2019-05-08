const db = require('../../models');
const crypto = require('crypto');

module.exports = async (token, name, location) => {

  let meeting = await db.Meeting.findOne({
    token: token
  });

  let meetingUser = new db.MeetingUser({
    name: name,
    location: location,
    meetingID: meeting._id,
  });

  let saveValue;

  await meetingUser.save().then((result) => {
    saveValue = result;
    console.log(result);
  });

  return saveValue;
};