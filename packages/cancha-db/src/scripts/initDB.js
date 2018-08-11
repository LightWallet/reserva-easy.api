#!/usr/bin/env node

let knex = null

var connDB = require('../pgtools')
var knexDB = require('knex')({ client: 'pg',
                               connection: connDB,
                               pool: {
                                   min: 0,
                                   max: 10
                               }
                             });

const { createTables } = require('../sql/tables.js');

const hasTables = () => {
  if(process.env.NODE_ENV == "test") {
    knex.schema.hasTable('canchas_test');
  } else {
    knex.schema.hasTable('canchas');
  }
}

const tryToCreateTables = async () => {
  const dbExists = await hasTables();
  if (dbExists) console.error('Error: already has tables');
  else await createTables();
};

const recreateDatabase = async () => {
    try {
        await knexDB.raw(`drop DATABASE ${process.env.PG_DB}`)
    } catch(e){ console.error(e) }
    await knexDB.raw(`create DATABASE ${process.env.PG_DB}`)
}

const initDB = async () => {
  try {
    await recreateDatabase()
    knex = require('../index.js');
    await tryToCreateTables();
    await knex.destroy();
    await knexDB.destroy();
  } catch (err) {
    console.error(err);
  }
};

initDB();
