require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const passport = require('./config/passport');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const propertyStore = require('./lib/propertyStore');

const app = express();
const PORT = process.env.PORT || 3000;
const isTest = process.env.NODE_ENV === 'test';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules', 'chart.js', 'dist')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    store: process.env.MONGO_URI && !isTest
      ? MongoStore.create({
          mongoUrl: process.env.MONGO_URI,
          collectionName: 'sessions',
          ttl: 14 * 24 * 60 * 60
        })
      : undefined,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

app.use(publicRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    pageTitle: 'Page Not Found',
    message: 'The page you requested could not be found.'
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', {
    pageTitle: 'Server Error',
    message: error.message || 'Something went wrong.'
  });
});

app.locals.readyPromise = Promise.resolve()
  .then(async () => {
    if (!process.env.MONGO_URI || isTest) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    await propertyStore.ensureSeededProperties();
  })
  .catch((error) => {
    console.warn('MongoDB connection skipped or failed:', error.message);
  });

if (require.main === module) {
  app.locals.readyPromise.finally(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
