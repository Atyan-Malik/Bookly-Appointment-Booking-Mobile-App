// utils/AppError.js
// Throw this from anywhere (controllers, services) for expected, user-facing
// failures. The global error middleware (middlewares/errorHandler.js) knows
// how to turn it into the standard error response shape.
class AppError extends Error {
  constructor(message, statusCode = 400, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
