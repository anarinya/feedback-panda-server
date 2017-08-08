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
}, identifyUser));

async function identifyUser (accessToken, refreshToken, profile, done) {
  try {
    let newUser;
    const existingUser = await User.findOne({ googleID: profile.id });
    if (!existingUser) { 
      // If there is no pre-existing user, create the user
      newUser = await new User({ googleID: profile.id }).save();
      return done(null, newUser);
    }
    // If there is already a pre-existing user, stop and call done
    done(null, existingUser);
  } catch(e) {
    console.log(e);
  }
};