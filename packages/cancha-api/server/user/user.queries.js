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

async function update(id, params) {
  try {
  const user = await db('user')
    .where({ id })
    .update(params).returning("*")
    if(!user) return null
    return user[0]
  } catch(e) {
    //console.error("Something wrong happened,", e)
    return null
  }
}

async function del(id) {
  try {
    const user = await db('user')
          .where({ id })
          .del()
          .returning("*")

    return user
  }catch(e) {
    return null
  }
}

async function list(limit, skip, deletedStateId) {
  try {
    const users = await db.select()
          .from('user')
          .limit(limit)
          .whereNotIn({stateId: [deletedStateId]})
          .offset(skip)

  if(!users) return null

  for(const user in users) {
    await assignRoleToUser(user)
  }

  return users
  } catch(e) {
    return null
  }
}

module.exports = { assignRoleToUser, getUserById, create, update, list, del }
