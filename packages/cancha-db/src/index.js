const path = require("path");
const envDir = path.join(__dirname, '../../..')
var dotenv = require('dotenv').config({path: envDir + '/.env'})
const { convertDateToUTCTimestamp } = require('./date-utils.js');

const config = {
  client: 'pg'
};

const customDateTimeTypecaster = (field, next) => {
  // cast DATETIME to timestamp number
  if (field.type === 'DATETIME') {
    const date = new Date(field.string());
    return convertDateToUTCTimestamp(date);
  }
  return next();
};

if (process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line fp/no-mutation
  config.connection = {
    host: process.env.PG_HOST || '127.0.0.1',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASS || '123',
    database: process.env.PG_DB || 'canchas',
    timezone: 'UTC',
    typeCast: customDateTimeTypecaster
  };
} else {
  config.connection = {
    host: '127.0.0.1',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASS || '123',
    database: 'canchas_test',
    timezone: 'UTC',
    typeCast: customDateTimeTypecaster
  };
}

module.exports = require('knex')(config);
