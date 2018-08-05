const db = require('cancha-db');

const getUserDataByEmail = (user) => {
  return new Promise((resolve, reject) => {
    db
      .select(['name', 'email', 'password', 'roleId', 'phone', 'stateId'])
      .from('user')
      .where({ email:user.email }).then((result) => {
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
  });
}

module.exports = { getUserDataByEmail };
