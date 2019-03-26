const API_KEY = require('../../config/API_KEY.json');
const axios = require('axios');
const NAVER_API_ID = API_KEY.naverClientID;
const NAVER_API_KEY = API_KEY.naverAPI;
const URL = API_KEY.naverDrivingURL;

const shortestPath = async (startLng, startLat, endLng, endLat, optionCode = 'traoptimal') => {
  // TODO(Taeyoung) : let argument 'optionCode' be an integer type for using switch below
  let reqURL = URL + 'start=' + startLng + ',' + startLat + '&goal=' + endLng + ',' + endLat + '&option=' + optionCode;
  let distance;
  let duration;

  await axios.get(reqURL, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": NAVER_API_ID,
      "X-NCP-APIGW-API-KEY": NAVER_API_KEY
    }
  })
    .then((res) => {
      if (optionCode == 'traoptimal') {
        console.log(JSON.stringify("distance using optimal: " + res.data.route.traoptimal[0].summary.distance));
        console.log(JSON.stringify("duration using optimal: " + res.data.route.traoptimal[0].summary.duration));
        distance = res.data.route.traoptimal[0].summary.distance;
        duration = res.data.route.traoptimal[0].summary.duration;
      } else if (optionCode == 'trafast') {
        console.log(JSON.stringify("distance using fastest: " + res.data.route.trafast[0].summary.distance));
        console.log(JSON.stringify("duration using fastest: " + res.data.route.trafast[0].summary.duration));
        distance = res.data.route.trafast[0].summary.distance;
        duration = res.data.route.trafast[0].summary.duration;
      } else if (optionCode == 'tracomfort') {
        console.log(JSON.stringify("distance using comfort: " + res.data.route.tracomfort[0].summary.distance));
        console.log(JSON.stringify("duration using comfort: " + res.data.route.tracomfort[0].summary.duration));
        distance = res.data.route.tracomfort[0].summary.distance;
        duration = res.data.route.tracomfort[0].summary.duration;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return parseInt(duration / 60000);
};
module.exports = {
  shortestPath
};