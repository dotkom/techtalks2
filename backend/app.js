const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: `${__dirname}/.env` });

const app = express();

const mainHandler = require('./src/mainHandler');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/', mainHandler);

app.set('port', process.env.PORT || '8080');

module.exports = app;
