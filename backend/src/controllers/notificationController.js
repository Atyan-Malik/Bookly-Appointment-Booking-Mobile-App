const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const Notification = require('../models/Notification');

exports.list = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  sendSuccess(res, { data: { notifications, unreadCount } });
});

exports.markRead = catchAsync(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true });
  sendSuccess(res, { message: 'Marked as read' });
});