const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },

    date: {
      type: String,
      required: true, // YYYY-MM-DD
    },

    startTime: {
      type: String,
      required: true, // HH:mm
    },

    endTime: {
      type: String,
      required: true, // HH:mm
    },

    durationMinutes: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'PENDING',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW',
      ],
      default: 'PENDING',
    },

    notes: {
      type: String,
      default: '',
    },

    cancellationReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { professional: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['PENDING', 'CONFIRMED'] },
    },
  }
);

appointmentSchema.index({ customer: 1, date: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);