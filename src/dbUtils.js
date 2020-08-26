const mysql = require('mysql2/promise');
require('dotenv').config({ path: `${__dirname}/.env` });

function connect() {
  const { TECHTALKS_DB_HOST, TECHTALKS_DB_USER, TECHTALKS_DB_PASSWORD, TECHTALKS_DB_NAME } = process.env;
  return mysql.createConnection({
    host: TECHTALKS_DB_HOST,
    user: TECHTALKS_DB_USER,
    password: TECHTALKS_DB_PASSWORD,
    database: TECHTALKS_DB_NAME,
  });
}

function connectPool() {
  const { TECHTALKS_DB_HOST, TECHTALKS_DB_USER, TECHTALKS_DB_PASSWORD, TECHTALKS_DB_NAME } = process.env;
  return mysql.createPool({
    host: TECHTALKS_DB_HOST,
    user: TECHTALKS_DB_USER,
    password: TECHTALKS_DB_PASSWORD,
    database: TECHTALKS_DB_NAME,
  });
}

module.exports = { connect, connectPool };
