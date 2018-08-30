const db = require('cancha-db');

async function getStateById(id) {
  const state = await db('state').select().where({ id }).first()

  if(!state) return null
  return state
}

async function getStateByName(name) {
  const state = await db('state').select().where( {name } ).first()

  if(!state) return null
  return state
}

module.exports = { getStateById, getStateByName }
