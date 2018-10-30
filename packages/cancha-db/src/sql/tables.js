const db = require('../index.js');

const MAX_EMAIL_LENGTH = 80
const MAX_NAME_LENGTH = 80
const MAX_PHONE_LENGTH = 100

const createStateColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('name', 20).notNullable();
    table.unique(['name'])
};

const createRoleColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('type', 20).notNullable();
    table.unique(['type'])
};

const createUserColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('email', MAX_EMAIL_LENGTH).notNullable();
    table.string('name', MAX_NAME_LENGTH).notNullable();
    table.string('password').notNullable();
    table.string('phone', MAX_PHONE_LENGTH).notNullable();
    table.integer('roleId').unsigned().notNullable()
    table.integer('stateId').unsigned().notNullable()

    table.foreign('stateId').references('id').inTable('state');
    table.foreign('roleId').references('id').inTable('role');

    table.unique(['email'])
};

const createStripeCardColumns = table => {
    table.string('token').notNullable();
    table.integer('userId').unsigned().notNullable().index();

    table.foreign('userId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

    table.primary(['token','userId']);
};

const createSoccerPlaceColumns = table => {
    table.increments('id').primary().unsigned();
    table.integer('ownerId').unsigned().notNullable();
    table.string('name', MAX_NAME_LENGTH).notNullable().index();
    table.string('description');
    table.specificType('location', 'POINT').defaultTo(db.raw('POINT (-2.1463057, -79.9759361)'))

    table.foreign('ownerId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

    table.integer('stateId').unsigned().notNullable()
    table.foreign('stateId').references('id').inTable('state');
};

const createSoccerFieldColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('name', MAX_NAME_LENGTH).notNullable().index();
    table.string('description').notNullable()
    table.specificType('size', 'smallint').unsigned().notNullable();
    table.specificType('address', 'POINT').defaultTo(db.raw('POINT (-2.1463057, -79.9759361)')) // remove this hack

    table.integer('soccerPlaceId').unsigned().notNullable();
    table.foreign('soccerPlaceId')
        .references('id')
        .inTable('soccer_place')
        .onDelete('CASCADE')

    table.integer('stateId').unsigned().notNullable()
    table.foreign('stateId').references('id').inTable('state');
};

const createFieldPriceColumns = table => {
    table.increments('id').primary().unsigned();
    table.float('price').notNullable()
    table.float('reservationPrice').notNullable()

    table.integer('idField').unsigned().notNullable();
    table.foreign('idField')
        .references('id')
        .inTable('soccer_field')
        .onDelete('SET NULL')
};

const createSoccerFieldImagesColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('image_path').notNullable()

    table.integer('soccer_field_id').unsigned().notNullable();
    table.foreign('soccer_field_id')
        .references('id')
        .inTable('soccer_field')
        .onDelete('SET NULL')
};

const createSoccerPlaceImagesColumns = table => {
    table.increments('id').primary().unsigned();
    table.string('image_path').notNullable()

    table.integer('soccer_place_id').unsigned().notNullable();
    table.foreign('soccer_place_id')
        .references('id')
        .inTable('soccer_place')
        .onDelete('SET NULL')
};

const createReservationColumns = table => {
    table.increments('id').primary().unsigned();
    table.timestamp('created_at').defaultTo(db.fn.now());

    table.integer('client_id').unsigned().notNullable();
    table.integer('soccer_field_id').unsigned().notNullable();

    table.foreign('client_id')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

    table.foreign('soccer_field_id')
        .references('id')
        .inTable('soccer_field')
        .onDelete('SET NULL')
};

const createTables = () => {
  return db.schema
    .createTable('state', createStateColumns)
    .createTable('role', createRoleColumns)
    .createTable('users', createUserColumns)
    .createTable('stripe_card', createStripeCardColumns)
    .createTable('soccer_place', createSoccerPlaceColumns)
    .createTable('soccer_field', createSoccerFieldColumns)
    .createTable('field_price', createFieldPriceColumns)
    .createTable('soccer_field_images', createSoccerFieldImagesColumns)
    .createTable('soccer_place_images', createSoccerPlaceImagesColumns)
};

module.exports = {
  createTables
};
