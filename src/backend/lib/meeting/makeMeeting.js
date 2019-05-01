const db = require('../../models');
const crypto = require('crypto');

 let makeMeeting = async (name, num) => {
  let makedToken = crypto.randomBytes(100).toString('hex');

  let meeting = new db.Meeting({
    name: name,
    number: num,
    token: makedToken
  });

  let saveValue;

  await meeting.save().then((result) => {
    saveValue = result;
    console.log(result);
  });

  return saveValue;
};

module.exports = {
  makeMeeting
};
