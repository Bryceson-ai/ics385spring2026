import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@mauiluxury.example.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeNow123!';

if (!MONGO_URI) {
  console.error('MONGO_URI is required in .env to run seed-admin.js');
  process.exit(1);
}

await mongoose.connect(MONGO_URI);

const existing = await User.findOne({ email: ADMIN_EMAIL });
if (existing) {
  console.log(`Admin already exists: ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
  process.exit(0);
}

await User.create({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role: 'admin',
});

console.log(`Admin account created: ${ADMIN_EMAIL}`);
console.log('Password was set from ADMIN_PASSWORD environment variable.');

await mongoose.disconnect();
