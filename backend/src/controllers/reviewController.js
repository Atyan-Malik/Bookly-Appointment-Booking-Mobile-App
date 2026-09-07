const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Professional = require('../models/Professional');

exports.listForProfessional = catchAsync(async (req, res) => {
  const reviews = await Review.find({ professional: req.params.professionalId })
    .populate('customer', 'name avatar')
    .sort({ createdAt: -1 });
  sendSuccess(res, { data: reviews });
});

exports.create = catchAsync(async (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new AppError('Appointment not found.', 404);
  if (String(appointment.customer) !== String(req.user._id)) {
    throw new AppError('You can only review your own appointments.', 403);
  }
  if (appointment.status !== 'COMPLETED') {
    throw new AppError('You can only review completed appointments.', 400);
  }

  let review;
  try {
    review = await Review.create({
      customer: req.user._id,
      professional: appointment.professional,
      appointment: appointmentId,
      rating,
      comment,
    });
  } catch (err) {
    if (err.code === 11000) throw new AppError('You already reviewed this appointment.', 409);
    throw err;
  }

  // Recalculate the professional's aggregate rating.
  const stats = await Review.aggregate([
    { $match: { professional: appointment.professional } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Professional.findByIdAndUpdate(appointment.professional, {
    rating: stats[0]?.avgRating || 0,
    reviewCount: stats[0]?.count || 0,
  });

  sendSuccess(res, { statusCode: 201, message: 'Review submitted', data: review });
});