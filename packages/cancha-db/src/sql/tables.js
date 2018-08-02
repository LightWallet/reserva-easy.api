const db = require('../index.js');

const MAX_EMAIL_LENGTH = 80
const MAX_NAME_LENGTH = 80
const MAX_PHONE_LENGTH = 100

const createRoleColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('type', 20).notNullable();
};

const createUserColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('email', MAX_EMAIL_LENGTH).notNullable();
    table.string('name', MAX_NAME_LENGTH).notNullable();
    table.string('password').notNullable();
    table.string('phone', MAX_PHONE_LENGTH).notNullable();
    table.string('salt').notNullable();
    table.integer('roleId').unsigned().notNullable()

    table.foreign('roleId').references('id').inTable('role');
};

const createStripeCardColumns = table => {
    table.string('token').notNullable();
    table.integer('userId').unsigned().notNullable().index();

    table.foreign('userId')
        .references('id')
        .inTable('user')
        .onDelete('CASCADE')

    table.primary(['token','userId']);
};

const createTables = () => {
  return db.schema
    .createTable('role', createRoleColumns)
    .createTable('user', createUserColumns)
    .createTable('stripe_card', createStripeCardColumns)
};

module.exports = {
  createTables
};
