const ApplicationError = require('./ApplicationError');

class UserNotFoundError extends ApplicationError {
  constructor(message) {
    super(message || 'No User found.', 404);
  }
}

module.exports = UserNotFoundError;
