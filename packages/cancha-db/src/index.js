const { convertDateToUTCTimestamp } = require('./date-utils.js');

const { PG_HOST, PG_USER, PG_PASS, PG_DB } = process.env;
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
    host: PG_HOST || '127.0.0.1',
    user: PG_USER || 'postgres',
    password: PG_PASS || '123',
    database: PG_DB || 'canchas',
    timezone: 'UTC',
    typeCast: customDateTimeTypecaster
  };
}

module.exports = require('knex')(config);
