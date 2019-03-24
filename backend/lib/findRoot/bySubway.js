const direction = require('../../exam.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const API_KEY = require('../../config/API_KEY.json');

const shortestPath = async (startlng, startlet, endlng, endlat) => {

  let transportAPI = 'http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBusNSub?'
    + 'ServiceKey=' + API_KEY.transport
    + '&startX=' + startlng
    + '&startY=' + startlet
    + '&endX=' + endlng
    + '&endY='+ endlat;

  let time;

  await axios.get(transportAPI)
    .then((res) => {
      parseString(res.data, (err, result) => {
        console.log(result.ServiceResult.msgBody[0].itemList[0].time[0]);
        time = result.ServiceResult.msgBody[0].itemList[0].time[0];
      });
    })
    .catch((err) => {
      console.log(err);
    })

  return time;
};

module.exports = {
  shortestPath
};
