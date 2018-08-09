const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const stateController = require('./state.controller');
const config = require('../../config/config');
const expressJwt = require('express-jwt');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/roles - Get list of states */
  .get(stateController.list)

router.route('/:stateId')
  /** GET /api/roles/:stateId - Get state */
  .get(stateController.get)

/** Load role when API with stateId route parameter is hit */
router.param('stateId', stateController.load);

module.exports = router;
