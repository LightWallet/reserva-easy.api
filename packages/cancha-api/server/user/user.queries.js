const db = require('cancha-db');
const stateConstants = require('../../constants/state.constants');
const UserAlreadyExistsError = require('../errors/UserAlreadyExistsError');
const UserNotCreatedError = require('../errors/UserNotCreatedError');

async function assignRoleToUser(user) {
  const role = await db.select()
        .from('role')
        .where({id: user.roleId}).first()
  user.role = role
}

async function getUserById(id) {
  const user = await db.select().from('users').first().where({ id })

  if(!user) return null
  return user
}

async function create(params) {
  try {
    const userDB = await db('users').select('*').
          where( {email:params.email} ).
          whereIn('stateId', [stateConstants.ACTIVE, stateConstants.PREMIUM, stateConstants.INACTIVE])

    /* user already exists and is active */
    if(userDB.length !== 0) {
      throw new UserAlreadyExistsError()
    }

    const user = await db('users').insert(params).returning('*')
    if(!user) throw new UserNotCreatedError()
    return user[0]
  } catch(e) {
    return e
  }
}

async function update(id, params) {
  try {
  const user = await db('users')
    .where({ id })
    .update(params).returning("*")
    if(!user) return null
    return user[0]
  } catch(e) {
    return null
  }
}

async function del(id) {
  try {
    const user = await db('users')
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
          .from('users')
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
