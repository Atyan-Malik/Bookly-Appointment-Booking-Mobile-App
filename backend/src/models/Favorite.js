const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'Professional', required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ customer: 1, professional: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);