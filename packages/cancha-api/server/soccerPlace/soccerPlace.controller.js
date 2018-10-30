const queries = require('./soccerPlace.queries')
const bcrypt = require('bcrypt');
const config = require('../../config/config');
const aws = require('../helpers/s3');

/**
 * Load soccerPlace and append to req.
 */
async function load(req, res, next, id) {
  try {
    const soccerPlace = await queries.loadSoccerPlaceFromId(id)
    if(!soccerPlace) throw new Error({error: "soccerplace not found"})
    req.soccerPlace = soccerPlace
    next()
  } catch(e) {
    res.status(404)
    return res.json({ "error": "Not found" })
  }
}

/**
 * Get soccerPlace
 * @returns {soccerPlace}
 */
async function get(req, res) {

    const owner = await queries.getOwnerOrFail(req.user.email)

    if(!owner) {
      res.status(403)
      return res.json({error: "Forbidden"});
    }

  const ownerId = owner.id

  if(req.soccerPlace.ownerId !== ownerId) {
      res.status(403)
      return res.json({error: "Forbidden"});
    }


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
  const owner = await queries.getOwnerOrFail(req.user.email)

  if(!owner) {
    throw new Error({error: "User not found"})
  }

  const name = req.body.name
  const description = req.body.description
  const location = req.body.location
  const userState = await queries.getUserState(owner.stateId);
  const active = (['ACTIVE', 'PREMIUM'].indexOf(userState.name)> -1) ? true : false
  if (!req.files) {
    res.status(401)
    return res.json({error: "No files uploaded" })

  }
  else  {
    const imagesHaveRightFormat = Object.keys(req.files).some((key) => {
      return (["image/jpeg", "image/png"].indexOf(req.files[key].mimetype) >= 0)
    })

    if(!imagesHaveRightFormat) {
        res.status(403)
        return res.json({error: "Forbidden type of image" })
    }

    await Object.keys(req.files).forEach(async (key) => {
      const hash = `${owner.id}-${req.files[key].name}-${new Date().getTime()}`
      req.files[key].name = hash

      try {
        await aws.uploadToS3(req.files[key])
      } catch(e) {
        res.status(500)
        return res.json({error: "Error creating image" })
      }

      // create the soccer place
      const soccerPlace = await queries.createSoccerPlaceFromData(
        name,
        description,
        location,
        active,
        req.files,
        owner.id)
      if(!soccerPlace) {
        res.status(500)
        return res.json({error: "Could not create soccerPlace"})
      }

      res.status(200)
      return res.json(soccerPlace)
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
      res.status(404)
      return res.json({error: "Not found"})
    } else  {
      return res.json(places)
    }

  } catch(e) {
        res.status(400)
        return res.json({error: "Could not send soccer places"})
  }
}

async function del(req, res, next) {
    const owner = await queries.getOwnerOrFail(req.user.email)

    if(!owner) {
      res.status(403)
      return res.json({error: "Forbidden"});
    }

  const ownerId = owner.id

  if(req.soccerPlace.ownerId !== ownerId) {
      res.status(403)
      return res.json({error: "Forbidden"});
    }

  const soccerplace = req.soccerPlace
  if(!soccerplace) {
    res.status(404)
    return res.json({error:"Error querying the soccerplace"})
  }

  const isDeleted = await queries.deleteSoccerPlaceFromId(soccerplace.id)

  if(!isDeleted) {
    res.status(500)
    return res.json({error:"Error deleting"})
  } else {
    res.status(200)
    return res.json({success: "Deleted soccerplace", soccerPlace: soccerplace})
  }
}

module.exports = { load, get, create, del, list };
