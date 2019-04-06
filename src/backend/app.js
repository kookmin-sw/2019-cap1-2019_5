const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config/server_config.json');
const rootRouter = require('./router/index')();
const version = config.version;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/api', rootRouter);
app.set('views', path.join(__dirname, "../frontend"));
app.get('/api/' + version + '/map', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/main.html"));
});
app.get('/api/' + version + '/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/main.css"));
});
app.get('/api/' + version + '/geocoding.js', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/geocoding.js"));
});

app.listen(config.port || 80, () => {
  console.log("server start :", config.port)
});
