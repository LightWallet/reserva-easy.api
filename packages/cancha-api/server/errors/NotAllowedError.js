const ApplicationError = require('./ApplicationError');

class NotAllowedError extends ApplicationError {
  constructor(message) {
    super(message || 'Not allowedj', 403);
  }
}

module.exports = NotAllowedError;
