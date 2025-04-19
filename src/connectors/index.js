const mysql = require('./mysql');
const postgres = require('./postgres');
const mongo = require('./mongo');
const sqlite = require('./sqlite');

module.exports = {
  mysql,
  postgres,
  mongo,
  sqlite,
};