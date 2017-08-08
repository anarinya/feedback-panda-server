const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('mongoose').model('users');

// Generate identifying information for the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Turn the user ID into a user
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

// Setup PassportJS Google OAuth Strategy
// This will run when called from index.js
passport.use(new GoogleStrategy({
  // Env vars obtained from index.js dotenv require
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ googleID: profile.id });

  if (existingUser) return done(null, existingUser);

  const user = await new User({ googleID: profile.id }).save();
  done(null, user);
}));