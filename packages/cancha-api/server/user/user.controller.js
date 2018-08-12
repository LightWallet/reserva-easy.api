const db = require('cancha-db');
const model = require('./user.model')
const bcrypt = require('bcrypt');
const config = require('../../config/config');

/**
 * Load user and append to req.
 */
async function load(req, res, next, id) {
  try {
    const user = await db.select().from('users').first().where({ id })
    await model.assignRoleToUser(db, user)
    res.locals.user = user
    next()
  } catch(e) {
    res.status(400)
    res.json({ "error": e.message })
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

  try {
    if(roleId && stateId) {
      const role = await db('role').select().where({ id: roleId }).first()
      if(role === null) {
        res.status(401);
        res.json({"error": "Role does not exist..."})
      }
      const state = await db('state').select().where({ id: stateId }).first()
      if(state === null) {
        res.status(401);
        res.json({"error": "State does not exist..."})
      }
      if(role.type === "ADMIN" || state.name === "PREMIUM" || state.name === "ACTIVE"){
        res.status(401);
        res.json({"error": "Not allowed role or state..."})
        return
      }
    }

    const user = await db('users').insert({email, password, name, phone, roleId, stateId }).returning('*')
    delete user[0]['password']
    res.status(200);
    res.json(user[0])
  } catch(e) {
    res.status(400)
    res.json({error: e.message })
  }
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
