require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./customerModel');
const Hotel = require('./hotelModel');
const Amenities = require('./amenitiesModel');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/myCustomerDB';
const ATLAS_URI = process.env.ATLAS_URI;

const customersToInsert = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567'
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '555-987-6543'
  },
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-555-1234'
  }
];

const hotelsToInsert = [
  {
    name: 'Pacific View Hotel',
    rating: 4.5,
    location: 'Honolulu',
    description: 'Oceanfront rooms and city access.'
  },
  {
    name: 'Mountain Breeze Inn',
    rating: 4.2,
    location: 'Hilo',
    description: 'Quiet mountain setting with scenic trails nearby.'
  },
  {
    name: 'Sunset Harbor Suites',
    rating: 4.8,
    location: 'Maui',
    description: 'Luxury suites with sunset harbor views.'
  }
];

const amenitiesToInsert = [
  {
    pool: true,
    lawn: true,
    bbq: false,
    laundry: true
  },
  {
    pool: false,
    lawn: true,
    bbq: true,
    laundry: true
  },
  {
    pool: true,
    lawn: false,
    bbq: true,
    laundry: false
  }
];

async function runForConnection(label, uri) {
  try {
    await mongoose.connect(uri);
    console.log(`\nConnected to ${label}.`);

    await Customer.deleteMany({});
    await Hotel.deleteMany({});
    await Amenities.deleteMany({});
    console.log('Deleted existing Customer, Hotel, and Amenities records.');

    const insertedCustomers = await Customer.insertMany(customersToInsert);
    console.log(`Inserted ${insertedCustomers.length} customers.`);

    const insertedHotels = await Hotel.insertMany(hotelsToInsert);
    console.log(`Inserted ${insertedHotels.length} hotels.`);

    const insertedAmenities = await Amenities.insertMany(amenitiesToInsert);
    console.log(`Inserted ${insertedAmenities.length} amenities records.`);

    await Customer.updateOne(
      { firstName: 'John', lastName: 'Doe' },
      { $set: { email: 'john.updated@example.com' } }
    );
    await Customer.updateOne(
      { firstName: 'Jane', lastName: 'Doe' },
      { $set: { phone: '555-111-2222' } }
    );
    console.log('Updated one customer email and one customer phone number.');

    const customersNamedDoe = await Customer.find({ lastName: 'Doe' });
    console.log("Customer query by lastName='Doe':", customersNamedDoe);

    const customerNamedAlice = await Customer.findOne({ firstName: 'Alice' });
    console.log("Customer query by firstName='Alice':", customerNamedAlice);

    const hotelByName = await Hotel.findOne({ name: 'Pacific View Hotel' });
    console.log("Hotel query by name='Pacific View Hotel':", hotelByName);

    const amenitiesWithPool = await Amenities.find({ pool: true });
    console.log("Amenities query by pool=true:", amenitiesWithPool);
  } catch (error) {
    console.error(`Error while running operations for ${label}:`, error.message);
  } finally {
    await mongoose.disconnect();
    console.log(`Disconnected from ${label}.`);
  }
}

async function main() {
  await runForConnection('local MongoDB', LOCAL_URI);

  const atlasConfigured = Boolean(ATLAS_URI) && !ATLAS_URI.includes('<');

  if (atlasConfigured) {
    await runForConnection('MongoDB Atlas', ATLAS_URI);
  } else {
    console.log('\nATLAS_URI is missing or still a placeholder. Skipping Atlas run.');
    console.log('Set a real Atlas connection string in .env, then run again.');
  }
}

main();