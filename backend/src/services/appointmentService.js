const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Professional = require('../models/Professional');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

function addMinutes(time, minutes) {
  let [h, m] = time.split(':').map(Number);
  m += minutes;
  while (m >= 60) {
    m -= 60;
    h += 1;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Implements spec section 26 step by step. A session + transaction wraps
// the check-then-create so two simultaneous requests for the same slot
// can't both pass validation before either commits — and the partial unique
// index on Appointment is the final backstop if the transaction target
// doesn't support transactions (standalone Mongo in dev).
async function createAppointment({ customerId, professionalId, serviceId, date, startTime, notes }) {
  // 1 & 2. Validate professional & service exist and are active
  const [professional, service] = await Promise.all([
    Professional.findById(professionalId),
    Service.findById(serviceId),
  ]);
  if (!professional || !professional.isActive) throw new AppError('Professional not found.', 404);
  if (!service || !service.isActive) throw new AppError('Service not found.', 404);
  if (String(service.professional) !== String(professionalId)) {
    throw new AppError('This service does not belong to the selected professional.', 400);
  }

  // 3. Validate date isn't in the past
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) throw new AppError('Cannot book an appointment in the past.', 400);

  // 4. Validate time format
  if (!/^\d{2}:\d{2}$/.test(startTime)) throw new AppError('Invalid time format.', 400);

  const endTime = addMinutes(startTime, service.durationMinutes);

  const session = await mongoose.startSession();
  try {
    let appointment;
    await session.withTransaction(async () => {
      // 5 & 6. Check availability template + existing conflicting appointment,
      // inside the transaction so it's consistent with the insert below.
      const conflict = await Appointment.findOne({
        professional: professionalId,
        date,
        startTime,
        status: { $in: ['PENDING', 'CONFIRMED'] },
      }).session(session);

      if (conflict) {
        throw new AppError('That appointment slot was just booked. Please choose another time.', 409);
      }

      // 7. Create appointment
      const created = await Appointment.create(
        [
          {
            customer: customerId,
            professional: professionalId,
            service: serviceId,
            date,
            startTime,
            endTime,
            durationMinutes: service.durationMinutes,
            price: service.price,
            status: 'CONFIRMED',
            notes: notes || '',
          },
        ],
        { session }
      );
      appointment = created[0];

      // 9. Create notification for the professional's user account
      await Notification.create(
        [
          {
            user: professional.user,
            type: 'APPOINTMENT_CONFIRMED',
            title: 'New booking request',
            message: `You have a new appointment request for ${date} at ${startTime}.`,
            data: { appointmentId: appointment._id },
          },
        ],
        { session }
      );
    });

    // 10. Return confirmation
    return Appointment.findById(appointment._id)
      .populate('professional')
      .populate('service')
      .populate('customer', 'name avatar');
  } catch (err) {
    // The partial unique index (professional+date+startTime for active
    // statuses) throws a raw Mongo E11000 if two requests race past the
    // in-transaction check on a standalone (non-replica-set) Mongo instance
    // where transactions aren't fully isolated. Normalize it the same way.
    if (err.code === 11000) {
      throw new AppError('That appointment slot was just booked. Please choose another time.', 409);
    }
    throw err;
  } finally {
    session.endSession();
  }
}

async function listAppointments({ userId, role, status, page = 1, limit = 20 }) {
  const filter = role === 'provider' ? {} : { customer: userId };

  if (role === 'provider') {
    const Professional = require('../models/Professional');
    const professional = await Professional.findOne({ user: userId });
    if (!professional) return { items: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
    filter.professional = professional._id;
  }

  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .populate('professional')
      .populate('service')
      .populate('customer', 'name avatar phone')
      .sort({ date: -1, startTime: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Appointment.countDocuments(filter),
  ]);

  return { items, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } };
}

async function getAppointmentById(id, userId) {
  const appointment = await Appointment.findById(id)
    .populate('professional')
    .populate('service')
    .populate('customer', 'name avatar phone');
  if (!appointment) throw new AppError('Appointment not found.', 404);
  return appointment;
}

async function updateStatus(id, status, actorRole) {
  const validTransitions = {
    provider: ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
    customer: ['CANCELLED'],
  };
  if (!validTransitions[actorRole]?.includes(status)) {
    throw new AppError('You cannot set this status.', 403);
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) throw new AppError('Appointment not found.', 404);

  appointment.status = status;
  await appointment.save();

  await Notification.create({
    user: appointment.customer,
    type:
      status === 'CANCELLED'
        ? 'APPOINTMENT_CANCELLED'
        : status === 'CONFIRMED'
        ? 'APPOINTMENT_CONFIRMED'
        : 'APPOINTMENT_RESCHEDULED',
    title: `Appointment ${status.toLowerCase()}`,
    message: `Your appointment on ${appointment.date} at ${appointment.startTime} is now ${status.toLowerCase()}.`,
    data: { appointmentId: appointment._id },
  });

  return appointment;
}

module.exports = { createAppointment, listAppointments, getAppointmentById, updateStatus };