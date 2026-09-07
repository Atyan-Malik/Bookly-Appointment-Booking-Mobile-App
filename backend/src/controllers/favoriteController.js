const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const Favorite = require('../models/Favorite');

exports.list = catchAsync(async (req, res) => {
  const favorites = await Favorite.find({
    customer: req.user.id,
  }).populate({
    path: 'professional',
    populate: [
      { path: 'user', select: 'name avatar' },
      { path: 'category', select: 'name icon' },
    ],
  });

  sendSuccess(res, { data: favorites });
});

exports.add = catchAsync(async (req, res) => {
  try {
    const favorite = await Favorite.create({
      customer: req.user.id,
      professional: req.body.professionalId,
    });

    sendSuccess(res, {
      statusCode: 201,
      message: 'Added to favorites',
      data: favorite,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('Already in your favorites.', 409);
    }

    throw err;
  }
});

exports.remove = catchAsync(async (req, res) => {
  await Favorite.findOneAndDelete({
    customer: req.user.id,
    professional: req.params.professionalId,
  });

  sendSuccess(res, {
    message: 'Removed from favorites',
  });
});