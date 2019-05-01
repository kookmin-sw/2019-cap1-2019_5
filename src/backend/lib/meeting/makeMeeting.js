const db = require('../../models');
const crypto = require('crypto');

 let makeMeeting = async (name, num) => {
  let makedToken = crypto.randomBytes(100).toString('hex');

  let meeting = new db.Meeting({
    name: name,
    number: num,
    token: makedToken
  });

  let resultValue;

  await meeting.save().then((result) => {
    resultValue = result;
    console.log(result);
  });

  return resultValue;
};

module.exports = {
  makeMeeting
};
