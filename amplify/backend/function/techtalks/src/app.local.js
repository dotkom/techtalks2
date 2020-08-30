const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mainHandler = require('./handlers/mainHandler');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.options('*', cors(corsOptions));

app.use('/', mainHandler);

app.listen(3000, () => {
  console.log('App started');
});
