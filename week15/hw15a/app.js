require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('./mongoose-compat');
const passport = require('passport');

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('[OK] MongoDB connected'))
  .catch((err) => console.error('[ERR] MongoDB connection failed:', err.message));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      maxAge: 86400000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.render('home', { user: req.user }));

app.get('/profile', require('./middleware/ensureAuth'), (req, res) =>
  res.render('profile', { user: req.user })
);

app.use('/auth', require('./routes/auth'));

app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/'));
  });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
