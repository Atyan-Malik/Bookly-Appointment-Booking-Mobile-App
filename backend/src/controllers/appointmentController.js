const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');
const appointmentService = require('../services/appointmentService');

exports.create = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment({
    customerId: req.user.id,
    professionalId: req.body.professionalId,
    serviceId: req.body.serviceId,
    date: req.body.date,
    startTime: req.body.startTime,
    notes: req.body.notes,
  });
  sendSuccess(res, { statusCode: 201, message: 'Appointment booked successfully', data: appointment });
});

exports.list = catchAsync(async (req, res) => {
  const result = await appointmentService.listAppointments({
    userId: req.user.id,
    role: req.user.role,
    status: req.query.status,
    page: req.query.page,
    limit: req.query.limit,
  });
  sendSuccess(res, { data: result });
});

exports.getById = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id, req.user._id);
  sendSuccess(res, { data: appointment });
});

exports.updateStatus = catchAsync(async (req, res) => {
  const appointment = await appointmentService.updateStatus(
    req.params.id,
    req.body.status,
    req.user.role
  );
  sendSuccess(res, { message: 'Appointment updated', data: appointment });
});