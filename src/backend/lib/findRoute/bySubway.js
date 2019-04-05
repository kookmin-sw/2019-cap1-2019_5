const direction = require('../../exam.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const API_KEY = require('../../config/API_KEY.json');

const shortestPath = async (startlng, startLat, endlng, endlat) => {

  let transportAPI = 'http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBusNSub?'
    + 'ServiceKey=' + API_KEY.publicTrans
    + '&startX=' + startlng
    + '&startY=' + startLat
    + '&endX=' + endlng
    + '&endY=' + endlat;

  let travelInfo = {};

  await axios.get(transportAPI)
    .then((res) => {
      parseString(res.data, (err, result) => {
        if (result.ServiceResult.msgBody[0] === '') {
          travelInfo['duration'] = 0;
          travelInfo['distance'] = 0;
          travelInfo['route'] = [];
          return travelInfo;
        }

        shortestRoute = result.ServiceResult.msgBody[0].itemList[0];
        travelInfo['duration'] = shortestRoute.time[0];
        travelInfo['distance'] = shortestRoute.distance[0];
        travelInfo['route'] = [];

        for (var i = 0; i < shortestRoute.pathList.length; i++) {
          let route = {};
          let transportation = shortestRoute.pathList[i].routeNm[0];

          if (transportation.endsWith("선")) {
            route["transportation"] = "subway";
          } else {
            route["transportation"] = "bus";
          }
          route["lineNum"] = transportation;
          route["startName"] = shortestRoute.pathList[i].fname[0];
          route["endName"] = shortestRoute.pathList[i].tname[0];

          travelInfo.route.push(route);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    })
  return travelInfo;
};

module.exports = {
  shortestPath
};
