const crypto = require('crypto');
const User = require('../models/User');
const Professional = require('../models/Professional');
const AppError = require('../utils/AppError');
const { signAccessToken, signRefreshToken } = require('../utils/generateTokens');

async function register({ name, email, password, role = 'customer', phone }) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('An account with this email already exists.', 409);

  const user = await User.create({ name, email, password, role, phone });

  // Providers get a minimal Professional profile created automatically so
  // they immediately show up in listings and can add services/availability.
  if (role === 'provider') {
    const Category = require('../models/Category');
    const defaultCategory = await Category.findOne();
    await Professional.create({
      user: user._id,
      profession: 'New Professional',
      category: defaultCategory?._id,
      bio: '',
    });
  }

  return issueSession(user);
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }
  if (!user.isActive) {
    throw new AppError('This account has been suspended. Contact support.', 403);
  }
  return issueSession(user);
}

async function refresh(refreshToken) {
  const jwt = require('jsonwebtoken');
  const env = require('../config/env');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch (e) {
    throw new AppError('Session expired. Please log in again.', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('Session expired. Please log in again.', 401);

  return { accessToken: signAccessToken(user) };
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  // Always respond the same way whether or not the user exists — avoids
  // leaking which emails are registered.
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 min
  await user.save({ validateBeforeSave: false });

  // Actual email sending is wired up via utils/sendEmail.js once EMAIL_*
  // env vars are configured — logged here so the flow is testable without SMTP.
  console.log(`[auth] Password reset token for ${email}: ${resetToken}`);
  return resetToken;
}

async function resetPassword(token, newPassword) {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new AppError('Reset link is invalid or has expired.', 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
}

function issueSession(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return { user: user.toSafeObject(), accessToken, refreshToken };
}

module.exports = { register, login, refresh, forgotPassword, resetPassword };