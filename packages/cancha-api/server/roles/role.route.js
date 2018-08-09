const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const roleController = require('./role.controller');
const config = require('../../config/config');
const expressJwt = require('express-jwt');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/roles - Get list of roles */
  .get(roleController.list)

router.route('/:roleId')
  /** GET /api/roles/:roleId - Get role */
  .get(roleController.get)

/** Load role when API with roleId route parameter is hit */
router.param('roleId', roleController.load);

module.exports = router;
