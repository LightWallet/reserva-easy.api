const jwt = require('jsonwebtoken');
const db = require('cancha-db');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');

/**
 * Returns list of states. NON protected route.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function list(req, res, next) {
  db.select()
    .from('state')
    .then(async (states) => {
      res.status(200);
      res.json(states)
    }).catch((e) => {
      res.status(400);
      res.json({ error: e.message })
    });
}

const get = async (req, res, next) => {
  if(!req.state) {
    res.status(400);
    res.json({error: "Estado no encontrado"})
  } else {
    res.status(200);
    res.json({route: req.state});
  }
}

const load = async (req, res, next, id) => {
  try {
    const state = await db.select().from('state').first().where({id})
    req.state = state;
    next();
  } catch(e) {
    next(e);
  }
}

module.exports = { list, get, load };
