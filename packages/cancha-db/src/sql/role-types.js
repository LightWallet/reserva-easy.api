const db = require('../index.js');

const insertRoleTypes = () =>
  db
    .table('role')
    .insert([
      { type: 'ADMIN' },
      { type: 'OWNER' },
      { type: 'CLIENT' }
    ]);

module.exports = { insertRoleTypes };
