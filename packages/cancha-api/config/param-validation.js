const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      password: Joi.string().min(10).max(50)
    },
    params: {
      userId: Joi.string().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().min(10).max(50).required()
    }
  }
};
