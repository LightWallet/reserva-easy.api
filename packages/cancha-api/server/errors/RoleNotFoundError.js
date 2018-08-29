const ApplicationError = require('./ApplicationError');

class RoleNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'Role Not Found.', 404);
  }
}

module.exports = RoleNotFoundError;
