const ApplicationError = require('./ApplicationError');

class UserCouldNotBeUpdatedError extends ApplicationError {
  constructor(message) {
    super(message || 'Error Updating User.', 404);
  }
}

module.exports = UserCouldNotBeUpdatedError;
