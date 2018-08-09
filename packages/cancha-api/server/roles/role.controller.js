const jwt = require('jsonwebtoken');
const db = require('cancha-db');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');

/**
 * Returns list of roles. NON protected route.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function list(req, res, next) {
  db.select()
    .from('role').whereNotIn('type', ['ADMIN'])
    .then(async (rolesResult) => {
      res.status(200);
      res.json(rolesResult)
    }).catch((e) => {
      res.status(400);
      res.json({ error: e.message })
    });
}

const get = async (req, res, next) => {
  if(!req.role) {
    res.status(400);
    res.json({error: "Rol no encontrado"})
  } else {
    res.status(200);
    res.json({route: req.role});
  }
}

const load = async (req, res, next, id) => {
  try {
    const route = await db.select().from('role').first().where({id}).whereNotIn('type', ['ADMIN'])
    req.role = route;
    next();
  } catch(e) {
    next(e);
  }
}

module.exports = { list, get, load };
