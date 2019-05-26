const public = require('./byPublic.js');
const driving = require('./byDriving.js');
const locationCandidates = require('./find_loc_candidates.js');

const calculateAvg = (groupTravelInfo) => {
  let midAvgDuration = 0;
  let midAvgDistance = 0;
  for (let j = 0; j < groupTravelInfo.length; ++j) {
    midAvgDuration += parseInt(groupTravelInfo[j].duration);
    midAvgDistance += parseInt(groupTravelInfo[j].distance);
  }
  midAvgDuration = parseInt(midAvgDuration / groupTravelInfo.length);
  midAvgDistance = parseInt(midAvgDistance / groupTravelInfo.length);

  let durationStdDeviation = 0;
  let distanceStdDeviation = 0;
  for (let j = 0; j < groupTravelInfo.length; ++j) {
    durationStdDeviation += Math.pow(groupTravelInfo[j].duration - midAvgDuration, 2);
    distanceStdDeviation += Math.pow(groupTravelInfo[j].distance - midAvgDistance, 2);
  }
  distanceStdDeviation = Math.sqrt(distanceStdDeviation / groupTravelInfo.length);
  durationStdDeviation = Math.sqrt(durationStdDeviation / groupTravelInfo.length)

  const averages = {
    midAvgDuration: midAvgDuration,
    midAvgDistance: midAvgDistance,
    distanceStdDeviation: distanceStdDeviation,
    durationStdDeviation: durationStdDeviation
  };

  return averages;
};

//TODO (Taeyoung): Get sortOption from Request Body
//TODO (Taeyoung): Separate this sorting algorithm as a module.
//sortOption : 0 (average distance, DEFAULT), 1 (average duration), 2 (distance standard deviation), 3 (duration standard deviation)
const sort = (output, sortOption) => {
  if (sortOption == 0) {
    output.areas.sort(function sortByAvgDistance(candidate1, candidate2) {
      if (candidate1.average.avgDistance == candidate2.average.avgDistance) {
        return 0;
      } else {
        return candidate1.average.avgDistance > candidate2.average.avgDistance ? 1 : -1;
      }
    });
  } else if (sortOption == 1) {
    output.areas.sort(function sortByAvgDuration(candidate1, candidate2) {
      if (candidate1.average.avgDuration == candidate2.average.avgDuration) {
        return 0;
      } else {
        return candidate1.average.avgDuration > candidate2.average.avgDuration ? 1 : -1;
      }
    });
  } else if (sortOption == 2) {
    output.areas.sort(function sortBydistanceStdDeviation(candidate1, candidate2) {
      if (candidate1.average.distanceStdDeviation == candidate2.average.distanceStdDeviation) {
        return 0;
      } else {
        return candidate1.average.distanceStdDeviation > candidate2.average.distanceStdDeviation ? 1 : -1;
      }
    });
  } else if (sortOption == 3) {
    output.areas.sort(function sortBydurationStdDeviation(candidate1, candidate2) {
      if (candidate1.average.durationStdDeviation == candidate2.average.durationStdDeviation) {
        return 0;
      } else {
        return candidate1.average.durationStdDeviation > candidate2.average.durationStdDeviation ? 1 : -1;
      }
    });
  };
};

const candidatesWithUserData = async (userData, searchPoint) => {
  let output = {
    'areas': []
  };

  let locCandidates = await locationCandidates.findLocationCandidates(searchPoint.location.lng, searchPoint.location.lat);

  for (let i = 0; i < locCandidates.length; i++) {
    let area = {};
    area['name'] = locCandidates[i].name;
    area['location'] = locCandidates[i].location;
    area['average'] = {};

    // user들 각각 계산
    let groupTravelInfo = [];
    for (let j = 0; j < userData.length; j++) {
      let userTravelInfo;
      if (userData[j].transportation == 'public') {
        userTravelInfo = await public.shortestPath(userData[j].location.coordinates[0], userData[j].location.coordinates[1], locCandidates[i].location.coordinates[0], locCandidates[i].location.coordinates[1]);
      } else {
        userTravelInfo = await driving.shortestPath(userData[j].location.coordinates[0], userData[j].location.coordinates[1], locCandidates[i].location.coordinates[0], locCandidates[i].location.coordinates[1]);
      }
      groupTravelInfo.push(userTravelInfo);
    }
    area['users'] = groupTravelInfo;

    let averages = calculateAvg(groupTravelInfo);
    area.average.avgDuration = averages.midAvgDuration;
    area.average.avgDistance = averages.midAvgDistance;
    area.average.distanceStdDeviation = averages.distanceStdDeviation;
    area.average.durationStdDeviation = averages.durationStdDeviation;

    output.areas.push(area);
  }

  sort(output, 3);

  return output;
}

module.exports = candidatesWithUserData;
