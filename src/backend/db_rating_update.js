//To connect DB , must excute mongodb
let fs = require("fs");
const db = require('./models');

db.connectDB().then(async () => {
  let candidateLocs = await db.CandidateLocs.find();

  console.log("전체 지역 수 : " + candidateLocs.length);

  let votingData = [];

  for (let i = 0; i < candidateLocs.length; i++) {
    let voted = await db.VotedLocs.find({
      location: candidateLocs[i].name
    });
    votingData.push({
      name: candidateLocs[i].name,
      voted: voted.length
    });
  };

  votingData.sort(function sortBydurationStdDeviation(candidate1, candidate2) {
    if (candidate1.voted == candidate2.voted) {
      return 0;
    } else {
      return candidate1.voted > candidate2.voted ? -1 : 1;
    }
  });

  for (let i = 0; i < votingData.length; i++) {
    await db.CandidateLocs.findOneAndUpdate(
      {
        name: votingData[i].name
      },
      {
        $set:
          { ratingByVoting: parseFloat((2 - 2 / votingData.length * i).toFixed(2)) }
      },
      (err, res) => {

      }
    );
  }

});
