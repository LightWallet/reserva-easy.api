const ApplicationError = require('./ApplicationError');

class UserAlreadyExistsError extends ApplicationError {
  constructor(message) {
    super(message || 'User already exists.', 400);
  }
}

module.exports = UserAlreadyExistsError;
