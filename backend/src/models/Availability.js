const mongoose = require('mongoose');

// One document per professional per weekday. Providers edit this in the
// Calendar screen (Module 7 in the original plan) to set working hours.
const availabilitySchema = new mongoose.Schema(
  {
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0 = Sunday
    startTime: { type: String, default: '09:00' }, // "HH:mm" 24h
    endTime: { type: String, default: '17:00' },
    isClosed: { type: Boolean, default: false },
    // Specific fully-blocked dates (holidays, time off), ISO date strings "YYYY-MM-DD"
    blockedDates: [{ type: String }],
  },
  { timestamps: true }
);

availabilitySchema.index({ professional: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);