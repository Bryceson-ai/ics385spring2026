const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    island: {
      type: String,
      required: true,
      enum: ['Maui', "O'ahu", "Kaua'i", 'Hawaii Island', 'Molokai', 'Lanai']
    },
    type: {
      type: String,
      required: true,
      enum: ['hotel', 'vacation rental']
    },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    amenities: { type: [String], required: true },
    targetSegment: { type: String, required: true, trim: true },
    imageURL: { type: String, required: true, trim: true },
    reviews: { type: [reviewSchema], default: [] }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);
