const direction = require('../../exam.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const API_KEY = require('../../config/API_KEY.json');

const shortestPath = async (startlng, startlet, endlng, endlat) => {

  let transportAPI = 'http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBusNSub?'
    + 'ServiceKey=' + API_KEY.publicTrans
    + '&startX=' + startlng
    + '&startY=' + startlet
    + '&endX=' + endlng
    + '&endY=' + endlat;

  let time;
  let output = {};

  await axios.get(transportAPI)
    .then((res) => {
      parseString(res.data, (err, result) => {
        shortestRoute = result.ServiceResult.msgBody[0].itemList[0];

        output['duration'] = shortestRoute.time[0];
        output['distance'] = shortestRoute.distance[0];
        output['route'] = [];

        for (var i=0; i < shortestRoute.pathList.length ; i++) {
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

          output.route.push(route);
        }

      });
    })
    .catch((err) => {
      console.log(err);
    })

  return output;
};

module.exports = {
  shortestPath
};
