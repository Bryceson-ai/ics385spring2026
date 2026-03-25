// scripts/seed.js — Inserts 5 sample Maui Airbnb-style vacation rental documents
import mongoose from 'mongoose';
import Property from './Property.js';
import 'dotenv/config';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB — seeding properties...');

await Property.deleteMany({});

await Property.insertMany([
  {
    name: 'Kihei Studio by the Sea',
    island: 'Maui',
    type: 'vacation rental',
    description:
      'Cozy Airbnb studio steps from Kamaole Beach, perfect for Canadian visitors escaping winter and exploring South Maui at a great value.',
    amenities: ['wifi', 'kitchen', 'beach access', 'parking', 'air conditioning'],
    targetSegment: 'Canadian vacationers',
    imageURL: '/images/kihei-studio.jpg',
  },
  {
    name: 'Paia Surf Cottage',
    island: 'Maui',
    type: 'vacation rental',
    description:
      'Charming one-bedroom Airbnb cottage in the artsy town of Paia, a short walk from Ho\'okipa Beach and great local dining.',
    amenities: ['wifi', 'kitchen', 'outdoor shower', 'surfboard storage', 'patio'],
    targetSegment: 'Canadian vacationers',
    imageURL: '/images/paia-cottage.jpg',
  },
  {
    name: 'Lahaina Garden Guesthouse',
    island: 'Maui',
    type: 'vacation rental',
    description:
      'Quiet Airbnb guesthouse tucked behind a tropical garden in historic Lahaina, ideal for Canadian couples on a relaxing island getaway.',
    amenities: ['wifi', 'kitchen', 'garden', 'hammock', 'parking', 'ceiling fans'],
    targetSegment: 'Canadian vacationers',
    imageURL: '/images/lahaina-garden.jpg',
  },
  {
    name: 'Haiku Treehouse Retreat',
    island: 'Maui',
    type: 'vacation rental',
    description:
      'Unique Airbnb treehouse nestled in the lush Haiku rainforest, offering Canadian visitors a peaceful jungle escape with stunning valley views.',
    amenities: ['wifi', 'kitchen', 'jungle view', 'outdoor deck', 'bbq', 'parking'],
    targetSegment: 'Canadian vacationers',
    imageURL: '/images/haiku-treehouse.jpg',
  },
  {
    name: 'Napili Bay Beach Bungalow',
    island: 'Maui',
    type: 'vacation rental',
    description:
      'Affordable Airbnb bungalow right on Napili Bay in West Maui — a favourite among Canadian snowbirds for its calm snorkeling waters and sunset views.',
    amenities: ['wifi', 'kitchen', 'ocean view', 'snorkeling gear', 'beach chairs', 'parking'],
    targetSegment: 'Canadian vacationers',
    imageURL: '/images/napili-bungalow.jpg',
  },
]);

console.log('Seed complete — 5 Maui Airbnb properties inserted.');
await mongoose.disconnect();
