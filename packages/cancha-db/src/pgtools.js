const path = require("path");
const envDir = path.join(__dirname, '../../..')
var dotenv = require('dotenv').config({path: envDir + '/.env'})

var connDB = {
    database: 'postgres',
    charset  : 'utf8',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASS || '123',
    port: 5432,
    host: process.env.PG_HOST || '127.0.0.1'
};
module.exports = connDB
