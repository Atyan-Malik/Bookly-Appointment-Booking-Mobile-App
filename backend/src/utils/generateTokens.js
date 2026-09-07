const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

module.exports = { signAccessToken, signRefreshToken };