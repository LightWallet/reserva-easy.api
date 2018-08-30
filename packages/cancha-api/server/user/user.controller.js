const userQueries = require('./user.queries')
const roleQueries = require('../roles/role.queries')
const stateQueries = require('../states/state.queries')

const bcrypt = require('bcrypt');
const config = require('../../config/config');

// errors
const UserNotFoundError = require('../errors/UserNotFoundError');
const RoleNotFoundError = require('../errors/RoleNotFoundError');
const StateNotFoundError = require('../errors/StateNotFoundError');
const NotAllowedError = require('../errors/NotAllowedError');
const UserNotCreatedError = require('../errors/UserNotCreatedError');
const UserCouldNotBeUpdatedError = require('../errors/UserCouldNotBeUpdatedError');
const UsersListError = require('../errors/UsersListError');

/**
 * Load user and append to req.
 */
async function load(req, res, next, id) {
    const user = await userQueries.getUserById(id)
  if(user === null) {
    next(new UserNotFoundError())
  } else {
    await userQueries.assignRoleToUser(user)
    res.locals.user = user
    next()
  }
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
async function create(req, res, next) {
  const email = req.body.email
  const name = req.body.name
  const phone = req.body.phone
  const roleId = req.body.roleId
  const stateId = req.body.stateId
  const SALT = await bcrypt.genSalt(config.saltRounds)
  const password = await bcrypt.hash(req.body.password, SALT)

  if(roleId && stateId) {
    const role = await roleQueries.getRoleById(roleId)
    if(role === null){
      return next(new RoleNotFoundError())
    }
    const state = await stateQueries.getStateById(stateId)
    if(state === null) {
      return next(new StateNotFoundError())
    }
    if(role.type === "ADMIN" || state.name === "PREMIUM" || state.name === "ACTIVE") {
      return next(new NotAllowedError())
    }
  }

  const user = await userQueries.create({email, password, name, phone, roleId, stateId })
  if(!user) {
    return next(new UserNotCreatedError())
  }

  delete user['password']
  res.status(200);
  res.json(user)
}

/**
 * Update existing user
 * @property {string} req.body.name - The username of user.
 * @property {string} req.body.phone - The phone of user.
 * @returns {User}
 */
async function update(req, res, next) {
  const user = res.locals.user;
  const userNew = await userQueries.update(user.id, {
      name: req.body.name,
      phone: req.body.phone,
    })
  if(!userNew) return next(new UserCouldNotBeUpdatedError())
  res.status(200)
  res.json(...userNew)
}


/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */

async function list(req, res, next) {
  const { limit = 10, skip = 0 } = req.query;
  const deletedState = await stateQueries.getStateByName('DELETED')
  const users = userQueries.list(limit, skip, deletedState.id)

  if(!users) return next(new UsersListError())

  res.json(users)
}

/**
 * Delete user.
 * @returns {User}
 */
async function remove(req, res, next) {
  const user = res.locals.user;
  if(user.role.type !== 'ADMIN') {
    res.status(403)
    res.json({ error: "forbidden" })
    return
  }

  try {
    const deletedState = await stateQueries.getStateByName('DELETED') // DO NOT USE THIS YET...
    const userDeleted = await userQueries.delete(user.id)
    console.info(userDeleted)
    res.json(...userDeleted)
  }catch(e) {
    res.status(403)
    res.json({ error: "forbidden" })
    return
  }
}

module.exports = { load, get, create, update, list, remove };
