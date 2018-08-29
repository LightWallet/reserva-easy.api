const db = require('cancha-db');

async function getRoleById(id) {
  const role = await db('role').select().where({ id }).first()

  if(!role) return null
  return role
}

module.exports = { getRoleById }
