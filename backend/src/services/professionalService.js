const Professional = require('../models/Professional');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const AppError = require('../utils/AppError');

async function listProfessionals(query = {}) {
  const {
    category,
    city,
    search,
    sort = 'recommended',
    limit = 20,
    page = 1,
  } = query;

  const filter = {
    isActive: true,
  };

  if (category) {
    filter.category = category;
  }

  if (city) {
    filter['location.city'] = {
      $regex: city,
      $options: 'i',
    };
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  let sortOption;

  switch (sort) {
    case 'rating':
      sortOption = { rating: -1 };
      break;

    case 'price_asc':
      sortOption = { startingPrice: 1 };
      break;

    case 'price_desc':
      sortOption = { startingPrice: -1 };
      break;

    case 'popular':
      sortOption = { reviewCount: -1 };
      break;

    case 'recommended':
    default:
      sortOption = {
        isVerified: -1,
        rating: -1,
        reviewCount: -1,
      };
      break;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const skip = (pageNumber - 1) * limitNumber;

  return Professional.find(filter)
    .populate('user', 'name email')
    .populate('category', 'name slug icon')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber)
    .lean();
}
async function getProfessionalById(id) {
  // your existing code...
}

async function getServices(professionalId) {
  return Service.find({
    professional: professionalId,
    isActive: true,
  }).sort({ price: 1 });
}

// Customer-facing availability.
// KEEP THIS AS IT IS.
async function getAvailability(professionalId, date, durationMinutes = 30) {
  const Appointment = require('../models/Appointment');

  const dayOfWeek = new Date(date + 'T00:00:00').getDay();

  const template = await Availability.findOne({
    professional: professionalId,
    dayOfWeek,
  });

  if (
    !template ||
    template.isClosed ||
    template.blockedDates.includes(date)
  ) {
    return [];
  }

  const booked = await Appointment.find({
    professional: professionalId,
    date,
    status: { $in: ['PENDING', 'CONFIRMED'] },
  }).select('startTime');

  const bookedTimes = new Set(booked.map((b) => b.startTime));

  const slots = [];

  let [h, m] = template.startTime.split(':').map(Number);
  const [endH, endM] = template.endTime.split(':').map(Number);

  while (h < endH || (h === endH && m < endM)) {
    const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    slots.push({
      time: label,
      available: !bookedTimes.has(label),
    });

    m += durationMinutes;

    while (m >= 60) {
      m -= 60;
      h += 1;
    }
  }

  return slots;
}

// ==========================================
// PROVIDER CALENDAR
// ==========================================

// Get weekly availability for logged-in provider
async function getMyAvailability(userId) {
  const professional = await Professional.findOne({
    user: userId,
  });

  if (!professional) {
    throw new AppError('Professional profile not found.', 404);
  }

  return Availability.find({
    professional: professional._id,
  }).sort({ dayOfWeek: 1 });
}

// Update one weekday for logged-in provider
async function updateMyAvailability(userId, data) {
  const professional = await Professional.findOne({
    user: userId,
  });

  if (!professional) {
    throw new AppError('Professional profile not found.', 404);
  }

  const {
    dayOfWeek,
    startTime,
    endTime,
    isClosed,
  } = data;

  if (
    dayOfWeek === undefined ||
    dayOfWeek < 0 ||
    dayOfWeek > 6
  ) {
    throw new AppError('Invalid day of week.', 400);
  }

  if (!startTime || !endTime) {
    throw new AppError('Start time and end time are required.', 400);
  }

  if (startTime >= endTime) {
    throw new AppError(
      'End time must be later than start time.',
      400
    );
  }

  const availability = await Availability.findOneAndUpdate(
    {
      professional: professional._id,
      dayOfWeek,
    },
    {
      professional: professional._id,
      dayOfWeek,
      startTime,
      endTime,
      isClosed: Boolean(isClosed),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return availability;
}

module.exports = {
  listProfessionals,
  getProfessionalById,
  getServices,
  getAvailability,
  getMyAvailability,
  updateMyAvailability,
};