const util = require('util');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');



app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

module.exports = app;
