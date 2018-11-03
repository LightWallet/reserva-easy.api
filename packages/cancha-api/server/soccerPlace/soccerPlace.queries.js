const db = require('cancha-db');
const stateConstants = require('../../constants/state.constants');
const BUCKET_NAME = `canchaphotos`
const MAIN_URL = `http(s)://s3.amazonaws.com/${BUCKET_NAME}/`


const loadSoccerPlaceFromId = async (id) => {
  let soccerPlace = null
  try {
    soccerPlace = await db.select().from('soccer_place')
      .first()
      .where({ id , stateId: stateConstants.ACTIVE })
  } catch(e) {
  }

  return soccerPlace
}

const getOwnerOrFail = async (email) => {
  let user = null
  try {
    user = await db.select().from('users').first().where({ email })
    delete user.password
  } catch(e) {}
  return user
}

const createSoccerPlaceFromData = async(name, description, location, active, files, ownerId) => {
  let parsedLocation = location
  if(typeof(parsedLocation) !== 'object') {
    parsedLocation = JSON.parse(location)
  }
  try {
    const soccerPlace = await db('soccer_place').insert({
      name,
      location: db.raw(`point(${parsedLocation.latitude}, ${parsedLocation.longitude} )`),
      description,
      ownerId: ownerId,
      stateId: active ? stateConstants.ACTIVE : stateConstants.INACTIVE }).returning('*')


    await Object.keys(files).forEach(async (key) => {
      await db('soccer_place_images').insert({soccer_place_id: soccerPlace[0].id, image_path: `${MAIN_URL}${files[key].name}`})
  })

  return soccerPlace[0]
  } catch(e) {
    return null
  }
}

const getPlacesFromOwner = async (owner, limit, skip) => {
  await db.select()
    .from('soccer_place')
    .limit(limit)
    .where({ ownerId: owner.id , stateId: stateConstants.ACTIVE })
    .offset(skip).then(async (placesResult) => {
      return placesResult
    }).catch((e) => null);
}


const getUserState = async (stateId) => {
  try {
    return await db.select().from('state').first().where({id: stateId})
  } catch (e) {
    return null
  }
}

// transaction
const deleteSoccerPlaceFromId = async (placeId) => {
  let deletedPlace = null
  try {
    const tx = db.transaction();
    try {
        tx("soccer_field")
        .where({soccerPlaceId: placeId})
            .update({ stateId: stateConstants.INACTIVE });

        tx("soccer_place")
        .where({id: placeId, stateId: stateConstants.ACTIVE })
            .update({ stateId: stateConstants.INACTIVE });
        tx.commit();
    }
    catch (e) {
        tx.rollback()
        // As you can see, if you don't rethrow here
        // the outer catch is never triggered
        throw e;
    }
  }
  catch (e) { console.error(e) }

  return deletedPlace
}

module.exports = { loadSoccerPlaceFromId, getOwnerOrFail, createSoccerPlaceFromData, getPlacesFromOwner, getUserState, deleteSoccerPlaceFromId }
