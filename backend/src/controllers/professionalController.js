const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const professionalService = require('../services/professionalService');

exports.list = catchAsync(async (req, res) => {
  const result = await professionalService.listProfessionals(req.query);

  sendSuccess(res, {
    data: result,
  });
});

exports.getById = catchAsync(async (req, res) => {
  const professional = await professionalService.getProfessionalById(
    req.params.id
  );

  sendSuccess(res, {
    data: professional,
  });
});

exports.getServices = catchAsync(async (req, res) => {
  const services = await professionalService.getServices(req.params.id);

  sendSuccess(res, {
    data: services,
  });
});

// Customer booking availability
exports.getAvailability = catchAsync(async (req, res) => {
  const { date, duration } = req.query;

  const slots = await professionalService.getAvailability(
    req.params.id,
    date,
    duration ? Number(duration) : undefined
  );

  sendSuccess(res, {
    data: slots,
  });
});

// ==========================================
// PROVIDER PROFESSIONAL PROFILE
// ==========================================

// GET /professionals/me
exports.getMyProfessional = catchAsync(async (req, res) => {
  const professional = await professionalService.getMyProfessional(
    req.user.id
  );

  sendSuccess(res, {
    data: professional,
  });
});

// POST /professionals
exports.createProfessional = catchAsync(async (req, res) => {
  const professional = await professionalService.createProfessional(
    req.user.id,
    req.body
  );

  sendSuccess(res, {
    statusCode: 201,
    message: 'Professional profile created successfully',
    data: professional,
  });
});

// PUT /professionals/me
exports.updateMyProfessional = catchAsync(async (req, res) => {
  const professional = await professionalService.updateMyProfessional(
    req.user.id,
    req.body
  );

  sendSuccess(res, {
    message: 'Professional profile updated successfully',
    data: professional,
  });
});

// ==========================================
// PROVIDER AVAILABILITY
// ==========================================

exports.getMyAvailability = catchAsync(async (req, res) => {
  const availability = await professionalService.getMyAvailability(
    req.user.id
  );

  sendSuccess(res, {
    data: availability,
  });
});

exports.updateMyAvailability = catchAsync(async (req, res) => {
  const availability = await professionalService.updateMyAvailability(
    req.user.id,
    req.body
  );

  sendSuccess(res, {
    data: availability,
  });
});