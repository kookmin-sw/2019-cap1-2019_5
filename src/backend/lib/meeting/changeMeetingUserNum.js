const db = require('../../models');
const crypto = require('crypto');

 module.exports = async (token, num) => {
  let createdToken = crypto.randomBytes(100).toString('hex');

  let changedMeeting;

  await db.Meeting.findOneAndUpdate({
      token: token
    }, {$set:{num:"num"}}, {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      changedMeeting = doc;
  });

  return changedMeeting;
};
