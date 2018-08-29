const ApplicationError = require('./ApplicationError');

class UserNotCreatedError extends ApplicationError {
  constructor(message) {
    super(message || 'User could not be created', 400);
  }
}

module.exports = UserNotCreatedError;
