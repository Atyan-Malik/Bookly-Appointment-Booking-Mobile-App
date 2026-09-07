const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ professional: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ professional: 1, category: 1 });

module.exports = mongoose.model('Service', serviceSchema);