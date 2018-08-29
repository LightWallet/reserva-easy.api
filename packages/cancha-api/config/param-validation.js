const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().required(),
      password: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      roleId: Joi.number().required(),
      stateId: Joi.number().required(),
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
