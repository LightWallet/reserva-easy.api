const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const soccerPlaceController = require('./soccerPlace.controller');
const config = require('../../config/config');
const expressJwt = require('express-jwt');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/soccerPlaces - Get list of soccer places */
  .get([expressJwt({ secret: config.jwtSecret })], soccerPlaceController.list)

  /** POST /api/soccerPlaces - Create new soccer place */
  .post([expressJwt({ secret: config.jwtSecret })], soccerPlaceController.create);

router.route('/:soccerPlaceId')
  /** GET /api/soccerPlaces/:userId - Get soccer place */
  .get(expressJwt({ secret: config.jwtSecret }), soccerPlaceController.get)


router.param('soccerPlaceId', soccerPlaceController.load);

module.exports = router;
