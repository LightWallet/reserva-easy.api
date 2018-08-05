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
    username: value.get('email')
  }, config.jwtSecret);

  return { status: 200, resp: token };
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */


async function login(req, res, next) {
  const user = { email: req.body.email, password: req.body.password }
  return validatePassword(user).then(respondWithToken, handleLoginError).then((response) => {
    res.status(response.status)
    res.json(response)
  })
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
  const value = {email: req.user}
  const [foundRow] = await queries.getUserDataByEmail(value);

  if(foundRow) {
    const user = {...foundRow, ...value}
    delete user.get('password')
    res.status(200)
    return res.json({
      user: value
    });
  } else {
    res.status(500)
    return res.json({
      error: "User not found "
    })
  }
}

const validatePassword = async value => {
  const [foundRow] = await queries.getUserDataByEmail(value);
  if (foundRow) {
    const { password: hashedPassword } = foundRow;
    const passwordIsCorrect = await bcrypt.compare(
      value.get('password'),
      hashedPassword
    );

    // return value with name to create session object
    const valueFull = {...value, ...foundRow}
    return passwordIsCorrect ? valueFull : Promise.reject();
  }

  return Promise.reject();
};

module.exports = { login, getRandomNumber, getUserInformation };
