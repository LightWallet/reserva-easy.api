const db = require('cancha-db');

const getUserDataByEmail = async (user) => {
  try {
    const userResult = await
    db.select(['name', 'email', 'password', 'roleId', 'phone', 'stateId']).from('users')
      .where({ email:user.email }).first()
    if(userResult === null)  return "Empty User"
    const role = await db.select().from('role').where({id: userResult.roleId}).first()
    userResult.role = role
    return userResult
  } catch(e) {
    return e
  }
}

module.exports = { getUserDataByEmail };
