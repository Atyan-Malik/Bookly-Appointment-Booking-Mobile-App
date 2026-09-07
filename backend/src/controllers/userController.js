const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const User = require('../models/User');

exports.getMe = catchAsync(async (req, res) => {
  sendSuccess(res, { data: req.user.toSafeObject() });
});

exports.updateMe = catchAsync(async (req, res) => {
  const allowed = ['name', 'phone', 'avatar', 'location'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { message: 'Profile updated', data: user.toSafeObject() });
});