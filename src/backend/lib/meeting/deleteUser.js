const db = require('../../models');
const crypto = require('crypto');

module.exports = async (userID) => {

  let deletedUser = await db.MeetingUser.findOneAndDelete({
    _id: userID
  });

  return deletedUser;
};
