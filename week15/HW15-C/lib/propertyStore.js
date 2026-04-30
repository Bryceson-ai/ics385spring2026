const Property = require('../models/Property');

const seedProperties = [
  {
    name: 'Kihei Studio by the Sea',
    island: 'Maui',
    type: 'vacation rental',
    description: 'Cozy South Maui studio steps from the beach, ideal for Canadian travelers looking for value and walkable dining.',
    amenities: ['wifi', 'kitchen', 'beach access', 'parking', 'air conditioning'],
    targetSegment: 'Canadian winter vacationers',
    imageURL: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
    reviews: [
      { guestName: 'Claire', rating: 5, comment: 'Easy walk to the beach and perfect for a one-week stay.' }
    ]
  },
  {
    name: 'Waikiki City Lights',
    island: "O'ahu",
    type: 'hotel',
    description: 'Modern hotel suite near Waikiki nightlife with quick access to surf lessons and downtown dining.',
    amenities: ['pool', 'wifi', 'parking', 'city view'],
    targetSegment: 'Urban leisure travelers',
    imageURL: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    reviews: []
  },
  {
    name: 'Hanalei Garden Retreat',
    island: "Kaua'i",
    type: 'vacation rental',
    description: 'Quiet garden retreat with mountain views and a long-stay kitchen setup for remote workers and couples.',
    amenities: ['wifi', 'kitchen', 'garden patio', 'parking'],
    targetSegment: 'Slow-travel couples',
    imageURL: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=800&fit=crop',
    reviews: []
  }
];

const memoryProperties = seedProperties.map((property, index) => ({
  ...property,
  _id: String(index + 1),
  createdAt: new Date(),
  updatedAt: new Date()
}));

function useMemoryStore() {
  return process.env.NODE_ENV === 'test' || process.env.USE_IN_MEMORY_DB === 'true';
}

async function ensureSeededProperties() {
  if (useMemoryStore()) {
    return memoryProperties;
  }

  const count = await Property.countDocuments();
  if (count === 0) {
    await Property.insertMany(seedProperties);
  }

  return Property.find({}).sort({ createdAt: -1 }).lean();
}

async function listProperties(filter = {}) {
  if (useMemoryStore()) {
    const island = filter.island;
    return memoryProperties.filter((property) => !island || property.island === island);
  }

  return Property.find(filter).sort({ createdAt: -1 }).lean();
}

async function createProperty(payload) {
  const amenities = Array.isArray(payload.amenities)
    ? payload.amenities
    : String(payload.amenities || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

  if (useMemoryStore()) {
    const created = {
      _id: String(memoryProperties.length + 1),
      name: payload.name,
      island: payload.island,
      type: payload.type,
      description: payload.description,
      amenities,
      targetSegment: payload.targetSegment,
      imageURL: payload.imageURL,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryProperties.unshift(created);
    return created;
  }

  const property = await Property.create({
    ...payload,
    amenities
  });

  return property.toObject();
}

module.exports = {
  createProperty,
  ensureSeededProperties,
  listProperties,
  seedProperties,
  useMemoryStore
};
