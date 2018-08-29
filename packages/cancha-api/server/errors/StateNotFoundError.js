const ApplicationError = require('./ApplicationError');

class StateNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'Role Not Found.', 404);
  }
}

module.exports = StateNotFoundError;
