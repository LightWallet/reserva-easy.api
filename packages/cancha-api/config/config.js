const path = require("path");
const envDir = path.join(__dirname, '../../..')
var dotenv = require('dotenv').config({path: envDir + '/.env'})
const Joi = require('joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  PORT: Joi.number()
    .default(9000),
  JWT_SECRET: Joi.string().required()
    .description('JWT SECRET REQUIRED'),
  PG_HOST: Joi.string().required()
    .description('DB HOST URL'),
  PG_DB: Joi.string().required()
    .description('PG_DB NAME REQUIRED'),
  PG_PORT: Joi.number()
    .default(27017),
  PG_PASS: Joi.string().required(),
  PG_USER: Joi.string().required()
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  pg: {
    host: envVars.PG_HOST,
    port: envVars.PG_PORT,
    pass: envVars.PG_PASS,
    user: envVars.PG_USER,
    db: envVars.PG_DB,
  }
};

module.exports = config;
