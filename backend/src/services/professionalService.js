const Professional = require('../models/Professional');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const AppError = require('../utils/AppError');

// ==========================================
// CUSTOMER — PROFESSIONALS
// ==========================================

async function listProfessionals(query = {}) {
  console.log('==========================================');
  console.log('PROFESSIONAL SEARCH QUERY:', query);
  console.log('==========================================');

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

  // ==========================================
  // CATEGORY FILTER
  // ==========================================

  if (category) {
    filter.category = category;
  }

  // ==========================================
  // CITY FILTER
  // ==========================================

  if (city) {
    filter['location.city'] = {
      $regex: city,
      $options: 'i',
    };
  }

  // ==========================================
  // SEARCH
  // ==========================================

  let searchRegex = null;

  if (search?.trim()) {
    const escapedSearch = search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    searchRegex = new RegExp(escapedSearch, 'i');

    console.log('SEARCH TEXT:', search);
    console.log('SEARCH REGEX:', searchRegex);

    // Name/email are stored in User.
    const matchingUsers = await User.find({
      $or: [
        {
          name: searchRegex,
        },
        {
          email: searchRegex,
        },
      ],
    }).select('_id');

    const userIds = matchingUsers.map(
      (user) => user._id
    );

    console.log(
      'MATCHING USER IDS:',
      userIds
    );

    filter.$or = [
      {
        user: {
          $in: userIds,
        },
      },
      {
        profession: searchRegex,
      },
      {
        'location.city': searchRegex,
      },
    ];
  }

  // ==========================================
  // FINAL FILTER
  // ==========================================

  console.log(
    'FINAL PROFESSIONAL FILTER:',
    JSON.stringify(filter, null, 2)
  );

  // ==========================================
  // DEBUG — INDIVIDUAL CONDITIONS
  // ==========================================

  const activeProfessionals =
    await Professional.find({
      isActive: true,
    }).lean();

  const professionMatches =
    searchRegex
      ? await Professional.find({
          isActive: true,
          profession: searchRegex,
        }).lean()
      : [];

  const categoryMatches =
    category
      ? await Professional.find({
          isActive: true,
          category: category,
        }).lean()
      : [];

  console.log(
    '------------------------------------------'
  );

  console.log(
    'ACTIVE PROFESSIONALS:',
    activeProfessionals.length
  );

  console.log(
    'PROFESSION MATCHES:',
    professionMatches.length
  );

  console.log(
    'CATEGORY MATCHES:',
    categoryMatches.length
  );

  console.log(
    '------------------------------------------'
  );

  console.log(
    'PROFESSION MATCH DATA:',
    professionMatches.map(
      (professional) => ({
        id: professional._id,
        profession: professional.profession,
        category: professional.category,
        user: professional.user,
        city:
          professional.location?.city,
        isActive:
          professional.isActive,
      })
    )
  );

  console.log(
    'CATEGORY MATCH DATA:',
    categoryMatches.map(
      (professional) => ({
        id: professional._id,
        profession: professional.profession,
        category: professional.category,
        user: professional.user,
        city:
          professional.location?.city,
        isActive:
          professional.isActive,
      })
    )
  );

  // ==========================================
  // SORT
  // ==========================================

  let sortOption;

  switch (sort) {
    case 'rating':
      sortOption = {
        rating: -1,
      };
      break;

    case 'price_asc':
      sortOption = {
        startingPrice: 1,
      };
      break;

    case 'price_desc':
      sortOption = {
        startingPrice: -1,
      };
      break;

    case 'popular':
      sortOption = {
        reviewCount: -1,
      };
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

  // ==========================================
  // PAGINATION
  // ==========================================

  const pageNumber = Math.max(
    Number(page) || 1,
    1
  );

  const limitNumber = Math.min(
    Math.max(Number(limit) || 20, 1),
    50
  );

  const skip =
    (pageNumber - 1) * limitNumber;

  // ==========================================
  // FINAL DATABASE QUERY
  // ==========================================

  const professionals =
    await Professional.find(filter)
      .populate(
        'user',
        'name email'
      )
      .populate(
        'category',
        'name slug icon'
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean();

  console.log(
    '=========================================='
  );

  console.log(
    'PROFESSIONAL RESULTS:',
    professionals.length
  );

  console.log(
    'RESULT DATA:',
    professionals.map(
      (professional) => ({
        id: professional._id,
        profession:
          professional.profession,
        category:
          professional.category,
        user:
          professional.user,
        city:
          professional.location?.city,
        isActive:
          professional.isActive,
      })
    )
  );

  console.log(
    '=========================================='
  );

  return professionals;
}

// ==========================================
// CUSTOMER — PROFESSIONAL DETAIL
// ==========================================

async function getProfessionalById(id) {
  const professional =
    await Professional.findOne({
      _id: id,
      isActive: true,
    })
      .populate(
        'user',
        'name email phone avatar'
      )
      .populate(
        'category',
        'name slug icon'
      )
      .lean();

  if (!professional) {
    throw new AppError(
      'Professional not found.',
      404
    );
  }

  return professional;
}

// ==========================================
// CUSTOMER — SERVICES
// ==========================================

async function getServices(
  professionalId
) {
  return Service.find({
    professional: professionalId,
    isActive: true,
  })
    .populate(
      'category',
      'name slug icon'
    )
    .sort({
      price: 1,
    })
    .lean();
}

// ==========================================
// CUSTOMER — AVAILABILITY
// ==========================================

// Customer-facing availability.
// KEEP THIS AS IT IS.
async function getAvailability(
  professionalId,
  date,
  durationMinutes = 30
) {
  const Appointment =
    require('../models/Appointment');

  const dayOfWeek = new Date(
    date + 'T00:00:00'
  ).getDay();

  const template =
    await Availability.findOne({
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

  const booked =
    await Appointment.find({
      professional: professionalId,
      date,
      status: {
        $in: [
          'PENDING',
          'CONFIRMED',
        ],
      },
    }).select('startTime');

  const bookedTimes = new Set(
    booked.map(
      (booking) =>
        booking.startTime
    )
  );

  const slots = [];

  let [h, m] =
    template.startTime
      .split(':')
      .map(Number);

  const [endH, endM] =
    template.endTime
      .split(':')
      .map(Number);

  while (
    h < endH ||
    (h === endH && m < endM)
  ) {
    const label = `${String(h).padStart(
      2,
      '0'
    )}:${String(m).padStart(
      2,
      '0'
    )}`;

    slots.push({
      time: label,
      available:
        !bookedTimes.has(label),
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
// PROVIDER — PROFESSIONAL PROFILE
// ==========================================

// Get professional profile of logged-in provider
async function getMyProfessional(
  userId
) {
  const professional =
    await Professional.findOne({
      user: userId,
    })
      .populate(
        'user',
        'name email phone avatar'
      )
      .populate(
        'category',
        'name slug icon'
      );

  if (!professional) {
    throw new AppError(
      'Professional profile not found.',
      404
    );
  }

  return professional;
}

// ==========================================
// CREATE PROFESSIONAL
// ==========================================

async function createProfessional(
  userId,
  data
) {
  // A provider can have only ONE professional profile.
  const existingProfessional =
    await Professional.findOne({
      user: userId,
    });

  if (existingProfessional) {
    throw new AppError(
      'Professional profile already exists.',
      409
    );
  }

  // Validate category
  if (data.category) {
    const category =
      await Category.findOne({
        _id: data.category,
        isActive: true,
      });

    if (!category) {
      throw new AppError(
        'Invalid or inactive category.',
        400
      );
    }
  }

  // Validate required fields
  if (!data.profession?.trim()) {
    throw new AppError(
      'Profession is required.',
      400
    );
  }

  if (!data.category) {
    throw new AppError(
      'Category is required.',
      400
    );
  }

  if (
    data.experienceYears !==
      undefined &&
    (Number(
      data.experienceYears
    ) < 0 ||
      Number.isNaN(
        Number(
          data.experienceYears
        )
      ))
  ) {
    throw new AppError(
      'Experience years must be a valid non-negative number.',
      400
    );
  }

  if (
    data.startingPrice !==
      undefined &&
    (Number(
      data.startingPrice
    ) < 0 ||
      Number.isNaN(
        Number(
          data.startingPrice
        )
      ))
  ) {
    throw new AppError(
      'Starting price must be a valid non-negative number.',
      400
    );
  }

  const professional =
    await Professional.create({
      // Never take user from req.body.
      // It comes from authenticated JWT.
      user: userId,

      profession:
        data.profession.trim(),

      category:
        data.category,

      bio:
        data.bio?.trim() || '',

      experienceYears:
        Number(
          data.experienceYears
        ) || 0,

      gender:
        data.gender,

      startingPrice:
        Number(
          data.startingPrice
        ) || 0,

      location: {
        city:
          data.location?.city?.trim() ||
          '',

        address:
          data.location?.address?.trim() ||
          '',
      },

      // Server-controlled fields
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      isActive: true,
    });

  return Professional.findById(
    professional._id
  )
    .populate(
      'user',
      'name email phone avatar'
    )
    .populate(
      'category',
      'name slug icon'
    );
}

// ==========================================
// UPDATE PROFESSIONAL
// ==========================================

async function updateMyProfessional(
  userId,
  data
) {
  const professional =
    await Professional.findOne({
      user: userId,
    });

  if (!professional) {
    throw new AppError(
      'Professional profile not found.',
      404
    );
  }

  // Validate category if being changed
  if (data.category !== undefined) {
    const category =
      await Category.findOne({
        _id: data.category,
        isActive: true,
      });

    if (!category) {
      throw new AppError(
        'Invalid or inactive category.',
        400
      );
    }

    professional.category =
      data.category;
  }

  if (data.profession !== undefined) {
    if (!data.profession.trim()) {
      throw new AppError(
        'Profession cannot be empty.',
        400
      );
    }

    professional.profession =
      data.profession.trim();
  }

  if (data.bio !== undefined) {
    professional.bio =
      data.bio.trim();
  }

  if (
    data.experienceYears !==
    undefined
  ) {
    const experienceYears =
      Number(
        data.experienceYears
      );

    if (
      Number.isNaN(
        experienceYears
      ) ||
      experienceYears < 0
    ) {
      throw new AppError(
        'Experience years must be a valid non-negative number.',
        400
      );
    }

    professional.experienceYears =
      experienceYears;
  }

  if (data.gender !== undefined) {
    professional.gender =
      data.gender;
  }

  if (
    data.startingPrice !==
    undefined
  ) {
    const startingPrice =
      Number(
        data.startingPrice
      );

    if (
      Number.isNaN(
        startingPrice
      ) ||
      startingPrice < 0
    ) {
      throw new AppError(
        'Starting price must be a valid non-negative number.',
        400
      );
    }

    professional.startingPrice =
      startingPrice;
  }

  if (data.location !== undefined) {
    professional.location = {
      city:
        data.location.city !==
        undefined
          ? data.location.city.trim()
          : professional.location?.city,

      address:
        data.location.address !==
        undefined
          ? data.location.address.trim()
          : professional.location?.address,
    };
  }

  // Do NOT allow provider to update:
  // user
  // rating
  // reviewCount
  // isVerified
  // isActive

  await professional.save();

  return Professional.findById(
    professional._id
  )
    .populate(
      'user',
      'name email phone avatar'
    )
    .populate(
      'category',
      'name slug icon'
    );
}

// ==========================================
// PROVIDER — CALENDAR
// ==========================================

// Get weekly availability for logged-in provider
async function getMyAvailability(
  userId
) {
  const professional =
    await Professional.findOne({
      user: userId,
    });

  if (!professional) {
    throw new AppError(
      'Professional profile not found.',
      404
    );
  }

  return Availability.find({
    professional:
      professional._id,
  }).sort({
    dayOfWeek: 1,
  });
}

// Update one weekday for logged-in provider
async function updateMyAvailability(
  userId,
  data
) {
  const professional =
    await Professional.findOne({
      user: userId,
    });

  if (!professional) {
    throw new AppError(
      'Professional profile not found.',
      404
    );
  }

  const {
    dayOfWeek,
    startTime,
    endTime,
    isClosed,
  } = data;

  const day =
    Number(dayOfWeek);

  if (
    !Number.isInteger(day) ||
    day < 0 ||
    day > 6
  ) {
    throw new AppError(
      'Day of week must be an integer between 0 and 6.',
      400
    );
  }

  // Closed day does not require working hours
  if (Boolean(isClosed)) {
    return Availability.findOneAndUpdate(
      {
        professional:
          professional._id,
        dayOfWeek: day,
      },
      {
        professional:
          professional._id,
        dayOfWeek: day,
        startTime:
          startTime || '09:00',
        endTime:
          endTime || '17:00',
        isClosed: true,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  // Open day requires working hours
  if (!startTime || !endTime) {
    throw new AppError(
      'Start time and end time are required for an open day.',
      400
    );
  }

  if (startTime >= endTime) {
    throw new AppError(
      'End time must be later than start time.',
      400
    );
  }

  return Availability.findOneAndUpdate(
    {
      professional:
        professional._id,
      dayOfWeek: day,
    },
    {
      professional:
        professional._id,
      dayOfWeek: day,
      startTime,
      endTime,
      isClosed: false,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // Customer
  listProfessionals,
  getProfessionalById,
  getServices,
  getAvailability,

  // Provider
  getMyProfessional,
  createProfessional,
  updateMyProfessional,

  // Provider calendar
  getMyAvailability,
  updateMyAvailability,
};