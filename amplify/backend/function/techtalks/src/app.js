const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const mainHandler = require('./mainHandler');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/', mainHandler);

app.listen(3000, () => {
  console.log('App started');
});

module.exports = app;
