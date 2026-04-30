const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('../config/passport');
const userStore = require('../lib/userStore');

const router = express.Router();

function renderLogin(res, options = {}) {
  const { errors = [], formData = {}, authError = '' } = options;
  return res.status(options.statusCode || 200).render('login', {
    pageTitle: 'Sign In',
    errors,
    formData,
    authError,
    googleEnabled: passport.googleStrategyEnabled
  });
}

function renderRegister(res, options = {}) {
  const { errors = [], formData = {}, authError = '' } = options;
  return res.status(options.statusCode || 200).render('register', {
    pageTitle: 'Create Account',
    errors,
    formData,
    authError,
    googleEnabled: passport.googleStrategyEnabled
  });
}

const loginValidators = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
];

const registerValidators = [
  body('displayName').trim().isLength({ min: 2, max: 60 }).withMessage('Display name must be 2-60 characters.').escape(),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain at least one letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.')
];

router.get('/login', (req, res) => {
  const authError = req.query.error === 'oauth'
    ? 'Google sign-in could not be completed.'
    : req.query.error === 'credentials'
      ? 'Invalid credentials.'
      : '';

  renderLogin(res, { authError });
});

router.get('/register', (req, res) => {
  renderRegister(res);
});

router.post('/register', registerValidators, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderRegister(res, {
      statusCode: 400,
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const existingUser = await userStore.findByEmail(req.body.email);
    if (existingUser) {
      return renderRegister(res, {
        statusCode: 409,
        authError: 'An account with that email already exists.',
        formData: req.body
      });
    }

    const user = await userStore.createLocalUser({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password,
      role: 'admin'
    });

    req.login(user, (error) => {
      if (error) {
        return next(error);
      }

      return res.redirect('/admin/dashboard');
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginValidators, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderLogin(res, {
      statusCode: 400,
      errors: errors.array(),
      formData: req.body
    });
  }

  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return renderLogin(res, {
        statusCode: 401,
        authError: info?.message || 'Invalid credentials.',
        formData: { email: req.body.email }
      });
    }

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.redirect('/admin/dashboard');
    });
  })(req, res, next);
});

router.get('/auth/google', (req, res, next) => {
  if (!passport.googleStrategyEnabled) {
    return renderLogin(res, {
      statusCode: 503,
      authError: 'Google sign-in is not configured yet.'
    });
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

router.get('/auth/google/callback', (req, res, next) => {
  if (process.env.NODE_ENV === 'test' && req.query.mockGoogleEmail) {
    return userStore
      .findOrLinkOrCreateGoogleUser({
        googleId: req.query.mockGoogleId || `mock-${req.query.mockGoogleEmail}`,
        email: req.query.mockGoogleEmail,
        displayName: req.query.mockDisplayName || 'Mock Google User'
      })
      .then((user) => {
        req.login(user, (error) => {
          if (error) {
            return next(error);
          }

          return res.redirect('/admin/dashboard');
        });
      })
      .catch(next);
  }

  if (!passport.googleStrategyEnabled) {
    return res.redirect('/login?error=oauth');
  }

  return passport.authenticate('google', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/login?error=oauth'
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
});

module.exports = router;
