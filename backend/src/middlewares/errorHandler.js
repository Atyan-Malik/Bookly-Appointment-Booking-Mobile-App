// middlewares/errorHandler.js
const env = require('../config/env');
const { sendError } = require('../utils/apiResponse');

// Translates raw driver/library errors into the friendly messages required
// by spec section 37 (never leak "MongoServerError: E11000...").
function normalizeError(err) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return { statusCode: 422, message: 'Validation failed', errors };
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return { statusCode: 404, message: `Resource not found`, errors: [] };
  }

  // MongoDB duplicate key (e.g. double-booking a slot, duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    const friendly =
      field === 'email'
        ? 'An account with this email already exists.'
        : field && field.toLowerCase().includes('slot')
        ? 'That appointment slot was just booked. Please choose another time.'
        : 'This record already exists.';
    return { statusCode: 409, message: friendly, errors: [] };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return { statusCode: 401, message: 'Invalid authentication token.', errors: [] };
  }
  if (err.name === 'TokenExpiredError') {
    return { statusCode: 401, message: 'Session expired. Please log in again.', errors: [] };
  }

  // Zod validation error (if thrown directly rather than handled in validate middleware)
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return { statusCode: 422, message: 'Validation failed', errors };
  }

  // Our own operational errors
  if (err.isOperational) {
    return { statusCode: err.statusCode, message: err.message, errors: err.errors || [] };
  }

  // Unknown/programmer error — never leak internals to the client
  return {
    statusCode: 500,
    message: 'Something went wrong. Please try again.',
    errors: [],
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const { statusCode, message, errors } = normalizeError(err);

  if (!err.isOperational || statusCode >= 500) {
    // Log full detail server-side only
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err);
  }

  return sendError(res, {
    statusCode,
    message,
    errors,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}

function notFoundHandler(req, res) {
  return sendError(res, {
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };
