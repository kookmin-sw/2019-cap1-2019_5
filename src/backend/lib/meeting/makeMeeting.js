const db = require('../../models');
const crypto = require('crypto');

 let makeMeeting = async (name, num) => {
  let createdToken = crypto.randomBytes(100).toString('hex');

  let meeting = new db.Meeting({
    name: name,
    number: num,
    token: createdToken
  });

  let savedMeeting;

  await meeting.save().then((result) => {
    savedMeeting = result;
    console.log(result);
  });

  return savedMeeting;
};

module.exports = {
  makeMeeting
};
