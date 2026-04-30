const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const userStore = require('../lib/userStore');

const googleStrategyEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await userStore.findByEmail(email);
        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

if (googleStrategyEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const verifiedEmail = (profile.emails || []).find((entry) => entry.verified)?.value || profile.emails?.[0]?.value || '';
          const user = await userStore.findOrLinkOrCreateGoogleUser({
            googleId: profile.id,
            email: verifiedEmail,
            displayName: profile.displayName || verifiedEmail || 'Google User'
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, String(user.id || user._id));
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userStore.findById(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

passport.googleStrategyEnabled = googleStrategyEnabled;

module.exports = passport;
