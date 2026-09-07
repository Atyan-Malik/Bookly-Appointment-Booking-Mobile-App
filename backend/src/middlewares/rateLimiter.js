// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

// General API limiter — generous, just guards against abuse.
const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
  },
});

// Stricter limiter for auth endpoints (login/register/forgot-password) to
// slow down brute-force and credential-stuffing attempts. Wired onto the
// auth routes in Module 2.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again in a few minutes.',
    errors: [],
  },
});

module.exports = { apiLimiter, authLimiter };
