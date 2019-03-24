const API_KEY = require('../../config/API_KEY.json');
const NAVER_API_ID = API_KEY.naverClientID;
const NAVER_API_KEY = API_KEY.naverAPI;
const shortestPath = async (startX, startY, endX, endY) => {
  // req : startX, startY, optioncode(default:traoptimal)
  // route.{optioncode}.summary.distance or route.{optioncode}.summary.duration
  return 0;
};

module.exports = {
  shortestPath
};