const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const responses = require('../http-responses')
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const queries = require('../sql/auth.queries.js')

const handleLoginError = err => {
  return err ? responses.unknownError(err) : responses.loginFailed();
}

const respondWithToken = value => {
  const token = jwt.sign({
    email: value.email,
    roleId: value.roleId
  }, config.jwtSecret, {
    expiresIn: '7d' //
  });

  return { token };
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */


async function login(req, res, next) {
  try {
    const user = { email: req.body.email, password: req.body.password }
    const userFull = await validatePassword(user)
    if(typeof(userFull) === 'string' || userFull === null) {
      res.status(400)
      res.json({error: "Error authenticating"})
      return;
    }
    const token  = respondWithToken(userFull)
    res.json({
      user: userFull,
      token: token.token
    });
  } catch(e) {
    res.status(400)
    res.json({ "error": e.message })
  }

}



/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

/**
 * Protected Route. Get User information by token
 * @param req
 * @param res
 * @returns {*}
 */
async function getUserInformation(req, res) {
  try {
    const value = { ...req.user }
    if(value.username) {
      value.email = value.username
    }
    const foundRow = await queries.getUserDataByEmail(value);

    if(!(foundRow instanceof Error)) {
      const user = {...foundRow, ...value}
      delete user.password
      res.status(200)
      return res.json({
        user
      });
    } else {
    res.status(400)
    res.json({ "error": foundRow.message })
    }
  } catch(e) {
    res.status(400)
    res.json({ "error": e.message })
  }
}

const validatePassword = async value => {
  const user = await queries.getUserDataByEmail(value);
  if (!(user instanceof Error) && !(user instanceof String) && !(typeof(user) === 'string')) {
    const hashedPassword = user.password
    const passwordIsCorrect = await bcrypt.compare(
      value.password,
      hashedPassword
    );

    // return value with name to create session object
    const valueFull = {...value, ...user}
    return passwordIsCorrect ? valueFull : null;
  } else {
    return null;
  }
};

module.exports = { login, getRandomNumber, getUserInformation };
