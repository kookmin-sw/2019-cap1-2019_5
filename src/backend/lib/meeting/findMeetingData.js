const db = require('../../models');
const crypto = require('crypto');

module.exports = async (token) => {

  let meeting = await db.Meeting.findOne({
    token: token
  });

  let meetingUsers = await db.MeetingUser.find({
    meetingID: meeting._id,
  });

  let resultAreas = await db.Result.findOne({
    meetingID: meeting._id
  });

  if (resultAreas != null) {
    for (let i = 0; i < resultAreas.areas.length; i++) {
      resultAreas.areas[i].vote = 0;
    }
    let result = await db.VotedLocs.find({
      ResultID: resultAreas._id
    });

    for (let i = 0; i < resultAreas.areas.length; i++) {
      for (let j = 0; j < result.length; j++) {
        if (result[j].location == resultAreas.areas[i].name) {
          resultAreas.areas[i].vote++;
        }
      }
    }
  }

  let areas;
  if (!resultAreas) {
    areas = [];
  } else {
    areas = resultAreas.areas;
  };

  let meetingData = {
    meeting: meeting,
    meetingUsers: meetingUsers,
    resultAreas: areas
  };

  return meetingData;
};
