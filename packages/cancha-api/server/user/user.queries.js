const db = require('cancha-db');

async function assignRoleToUser(user) {
  const role = await db.select()
        .from('role')
        .where({id: user.roleId}).first()
  user.role = role
}

async function getUserById(id) {
  const user = await db.select().from('user').first().where({ id })

  if(!user) return null
  return user
}

async function create(params) {
  try {
    const user = await db('user').insert(params).returning('*')
    if(!user) return null
    return user[0]
  } catch(e) {
    //console.error("Something wrong happened,", e)
    return null
  }


}

module.exports = { assignRoleToUser, getUserById, create }
