const ApplicationError = require('./ApplicationError');

class UsersListError extends ApplicationError {
  constructor(message) {
    super(message || 'Cannot list users...', 400);
  }
}

module.exports = UsersListError;
