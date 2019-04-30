const models = require('./models');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/server_config.json');
const rootRouter = require('./router/index')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/api', rootRouter);

models.connectDB().then(async () => {
  app.listen(config.port || 80, () =>
    console.log("server start :", config.port)
  );
});
