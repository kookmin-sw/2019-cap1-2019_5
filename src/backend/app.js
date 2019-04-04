const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config/server_config.json');
const rootRouter = require('./router/index')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/api', rootRouter);
app.set('views', path.join(__dirname, "../frontend"));
app.get('/api/v1/map', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/main.html"));
})

app.listen(config.port || 80, () => {
  console.log("server start :", config.port)
});