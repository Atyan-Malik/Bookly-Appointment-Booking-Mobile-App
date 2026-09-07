const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ professional: 1 });
reviewSchema.index({ appointment: 1 }, { unique: true }); // one review per appointment

module.exports = mongoose.model('Review', reviewSchema);