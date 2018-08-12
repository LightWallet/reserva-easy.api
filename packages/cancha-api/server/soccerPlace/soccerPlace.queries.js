const db = require('cancha-db');
const BUCKET_NAME = `canchaphotos`
const MAIN_URL = `http(s)://s3.amazonaws.com/${BUCKET_NAME}/`

const loadSoccerPlaceFromId = async (id) => {
  const soccerPlace = null
  try {
    soccerPlace = await db.select().from('soccer_place').first().where({ id })
  } catch(e) {
    console.error(e);
  }
  return soccerPlace
}

const getOwnerOrFail = async (email) => {
  const user = null
  try {
    user = await db.select().from('user').first().where({ email })
    delete user.password
  } catch(e) {
    console.error(e);
  }
  return user
}

const createSoccerPlaceFromData = async(name, description, location, active, files) => {
  try {
  const soccerPlace = await db('soccer_place').insert({
    name,
    location: db.raw(`point(${location.latitude}, ${location.longitude} )`),
    description,
    active }).returning('*')

  await Object.keys(files).forEach(async (name) => {
    await db.insert({soccer_place_id: soccerPlace.id, image_path: `${MAIN_URL}${files[name].name}`})
  })

  return soccerPlace
  } catch(e) {
    console.error(e)
    return null
  }
}

const getPlacesFromOwner = async (owner, limit, skip) => {
  await db.select()
    .from('soccer_place')
    .limit(limit)
    .where({ ownerId: owner.id })
    .offset(skip).then(async (placesResult) => {
      return placesResult
    }).catch((e) => null);
}


module.exports = { loadSoccerPlaceFromId, getOwnerOrFail, createSoccerPlaceFromData, getPlacesFromOwner }
