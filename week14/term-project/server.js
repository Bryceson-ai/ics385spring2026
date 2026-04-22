// server.js — Hawaii Hospitality Dashboard & Marketing Website
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import propertyRoutes from './routes/api.js';
import dashboardRoutes from './routes/dashboard.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import passport from './passport-config.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Never hardcode credentials
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-change-me';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MONGO_URI
      ? MongoStore.create({
          mongoUrl: MONGO_URI,
          collectionName: 'sessions',
          ttl: 60 * 60,
        })
      : undefined,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', dashboardRoutes);
app.use('/api/properties', propertyRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  if (!MONGO_URI) {
    console.warn('MongoDB not configured. Property routes may be unavailable, but analytics routes remain active.');
    return;
  }

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('Connection error:', err.message);
      console.warn('Continuing without MongoDB. Analytics routes remain active.');
    });
});