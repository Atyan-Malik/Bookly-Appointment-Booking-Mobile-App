const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const authService = require('../services/authService');

exports.register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Account created successfully', data: result });
});

exports.login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, { message: 'Logged in successfully', data: result });
});

exports.refresh = catchAsync(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  sendSuccess(res, { message: 'Token refreshed', data: result });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  sendSuccess(res, {
    message: 'If an account exists for that email, a reset link has been sent.',
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, { message: 'Password has been reset. You can now log in.' });
});

exports.logout = catchAsync(async (req, res) => {
  // Stateless JWT — logout is a client-side token clear. Kept as a real
  // endpoint so future blacklist/refresh-token revocation has a home.
  sendSuccess(res, { message: 'Logged out successfully' });
});