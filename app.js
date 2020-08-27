const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config({ path: `${__dirname}/.env` });
// eslint-disable-next-line import/no-unresolved
const usersRouter = require('routes/users');
// eslint-disable-next-line import/no-unresolved
const dbRouter = require('routes/db');
const debug = require('debug')('api:server');
const http = require('http');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/db', dbRouter);

// Serve frontend
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const result = parseInt(val, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(result)) {
    // named pipe
    return val;
  }

  if (result >= 0) {
    // port number
    return result;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
