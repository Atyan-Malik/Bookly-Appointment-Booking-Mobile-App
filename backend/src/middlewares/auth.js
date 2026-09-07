// src/middlewares/auth.js

const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const env = require('../config/env');

/**
 * Protect routes with JWT authentication.
 *
 * Expected header:
 * Authorization: Bearer <access_token>
 *
 * JWT payload:
 * {
 *   id: 'user_id',
 *   role: 'provider',
 *   ...
 * }
 */
const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No Authorization header
  if (!authHeader) {
    throw new AppError(
      'You are not logged in. Please log in to continue.',
      401
    );
  }

  // Invalid Authorization format
  if (!authHeader.startsWith('Bearer ')) {
    throw new AppError(
      'Invalid authorization format. Use Bearer token.',
      401
    );
  }

  const token = authHeader.split(' ')[1];

  // Empty token
  if (!token) {
    throw new AppError(
      'Authentication token is missing.',
      401
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(
        'Your session has expired. Please log in again.',
        401
      );
    }

    if (error.name === 'JsonWebTokenError') {
      throw new AppError(
        'Invalid authentication token. Please log in again.',
        401
      );
    }

    throw error;
  }

  // Make sure JWT contains the required user ID
  if (!decoded.id) {
    throw new AppError(
      'Invalid authentication token.',
      401
    );
  }

  // Attach authenticated user information
  req.user = decoded;

  next();
});


/**
 * Restrict a route to specific user roles.
 *
 * Example:
 * router.get(
 *   '/provider-only',
 *   protect,
 *   restrictTo('provider'),
 *   controller.handler
 * );
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'You must be authenticated to access this resource.',
        401
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action.',
        403
      );
    }

    next();
  };
};


module.exports = {
  protect,
  restrictTo,
};