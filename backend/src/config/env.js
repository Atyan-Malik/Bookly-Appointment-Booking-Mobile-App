// config/env.js
// Single source of truth for environment variables. Import this instead of
// reading process.env directly anywhere else in the codebase.
require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // Fail fast at boot rather than deep inside a request handler.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || '*',

  mongodbUri: required('MONGODB_URI', 'mongodb://localhost:27017/bookly'),

  jwt: {
    secret: required('JWT_SECRET', 'dev_only_insecure_secret'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: required(
      'JWT_REFRESH_SECRET',
      'dev_only_insecure_refresh_secret'
    ),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'Bookly <no-reply@bookly.app>',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  },

  isProd: process.env.NODE_ENV === 'production',
};

module.exports = env;
