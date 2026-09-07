const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profession: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    bio: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    images: [{ type: String }],
    location: {
      address: String,
      city: String,
      coordinates: { lat: Number, lng: Number },
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    startingPrice: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

professionalSchema.index({ profession: 'text', bio: 'text' });
professionalSchema.index({ category: 1 });
professionalSchema.index({ rating: -1 });

module.exports = mongoose.model('Professional', professionalSchema);