const queries = require('./soccerPlace.queries')
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const aws = require('../helpers/s3');

/**
 * Load soccerPlace and append to req.
 */
async function load(req, res, next, id) {
  try {
    const soccerPlace = queries.loadSoccerPlaceFromId(id)
    if(!soccerPlace) throw new Error({error: "soccerplace not found"})
    req.soccerPlace = soccerPlace
    next()
  } catch(e) {
    res.status(400)
    res.json({ "error": e.message })
  }
}

/**
 * Get soccerPlace
 * @returns {soccerPlace}
 */
function get(req, res) {
  return res.json(req.soccerPlace);
}

/**
 * Create new soccerPlace
 * @property {string} req.body.name - The soccer place's name
 * @property {string} req.body.description - The soccer place's description
 * @property {string} req.body.description - The soccer place's description
 * @property {location} req.body.location - The soccer place's location
 * @returns {SoccerPlace}
 */
async function create(req, res, next) {
  const user = req.user
  const owner = queries.getOwnerOrFail(req.user.email)

  if(!owner) {
    throw new Error({error: "User not found"})
  }

  const name = req.body.name
  const description = req.body.description
  const location = req.body.location
  const userState = queries.getUserState(owner.stateId);
  const active = (['ACTIVE', 'PREMIUM'].indexOf(userState.name)> -1) ? true : false
  if (!req.files) console.error('No files were uploaded')
  else  {
    await Object.keys(req.files).forEach(async (name) => {
      const hash = `${owner.id}-${name}-${new Date().getTime()}`
      req.files[name].name = hash
      try {
        await aws.uploadToS3(req.files[name])
      } catch(e) {
        res.status(500)
        res.json({error: "Error creating image" })
      }

      // create the soccer place
      const soccerPlace = await queries.createSoccerPlaceFromData(name, description, location, active, req.files)
      if(!soccerPlace) {
        res.status(500)
        res.json({error: "Could not create soccerPlace"})
        return
      }
      res.json(soccerPlace)
    })
  }
}


/**
 * Get soccer places list.
 * @property {number} req.query.skip - Number of soccer places to be skipped.
 * @property {number} req.query.limit - Limit number of soccer places to be returned.
 * @returns {User[]}
 */

async function list(req, res, next) {
  const { limit = 10, skip = 0 } = req.query;
  try {
    const owner = queries.getOwnerOrFail(req.user.email)

    if(!owner) {
      throw new Error({error: "Permission denied"})
    }

    const places = await queries.getPlacesFromOwner(owner, limit, skip)
    if(!places) {
      throw new Error({error: "fetch places error"})
    }

    res.json(places)
  } catch(e) {
        res.status(400)
        res.json({error: "Could not send soccer places"})
  }
}


module.exports = { load, get, create, list };
