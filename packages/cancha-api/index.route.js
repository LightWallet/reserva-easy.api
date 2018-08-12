const express = require('express');
const userRoutes = require('./server/user/user.route');
const soccerplaceRoutes = require('./server/soccerPlace/soccerPlace.route');
const authRoutes = require('./server/auth/auth.route');
const roleRoutes = require('./server/roles/role.route');
const stateRoutes = require('./server/states/state.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

router.use('/roles', roleRoutes);

router.use('/states', stateRoutes);

router.use('/soccerPlaces', soccerplaceRoutes);

module.exports = router;
