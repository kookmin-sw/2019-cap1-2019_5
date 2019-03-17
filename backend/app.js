const express = require('express');
const app = express();
const router = express.Router();
const config = require('./config/server_config.json');

const rootRouter = require('./router/index')();

app.use('/api', rootRouter);


app.listen(config.port || 80, () => {
  console.log("server start :", config.port)
});
