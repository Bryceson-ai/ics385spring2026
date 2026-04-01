// models/Property.js — Term Project Mongoose Schema
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    // 1. Property name
    name: { type: String, required: true },

    // 2. Hawaiian island the property is located on
    island: {
      type: String,
      required: true,
      enum: ['Maui', 'Oahu', 'Hawaii Island', 'Kauai', 'Molokai', 'Lanai'],
    },

    // 3. Accommodation type
    type: {
      type: String,
      required: true,
      enum: ['hotel', 'vacation rental'],
    },

    // 4. Marketing description shown to visitors
    description: { type: String, required: true, maxlength: 500 },

    // 5. List of amenities (e.g. pool, wifi, ocean view)
    amenities: { type: [String], required: true },

    // 6. Primary visitor segment this property targets
    targetSegment: { type: String, required: true },

    // 7. URL of the hero/thumbnail image
    imageURL: { type: String, required: true },

    // 8. Guest reviews embedded directly in each property
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

export default mongoose.model('Property', propertySchema);
