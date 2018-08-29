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
  try {
  const userNew = await db('users')
    .where({ id: user.id })
    .update({
      name: req.body.name,
      phone: req.body.phone,
    }).returning("*")
  res.status(200)
  res.json(...userNew)
  } catch(e) {
    res.status(400)
    res.json(e.message)
  }
}


/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */

async function list(req, res, next) {
  const { limit = 10, skip = 0 } = req.query;
  const deletedState = await db('state').select().where( {name: 'DELETED'} ).first()
  db.select(['id', 'email', 'name', 'phone', 'roleId', 'stateId'])
    .from('users')
    .limit(limit)
    .whereNotIn({stateId: [deletedState.id]})
    .offset(skip).then(async (usersResult) => {
      res.status(200);
      for(const user in usersResult) {
        await model.assignRoleToUser(db, user)
      }

      res.json(usersResult)

    }).catch((e) => res.json({error: e.message}));
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

  const deletedState = await db('state').select().where( {name: 'DELETED'} ).first()
  db('user')
    .update( {stateId: deletedState.id} )
    .where({id: user.id})
    .returning('*')
    .then((deletedUser) => {
      res.json(deletedUser);
    }).catch((e) => {
      res.status(403)
      res.json({ error: "forbidden" })
    })
}

module.exports = { load, get, create, update, list, remove };
