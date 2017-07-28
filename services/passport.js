const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Setup PassportJS Google OAuth Strategy
// This will run when called from index.js
passport.use(new GoogleStrategy({
  // Env vars obtained from index.js dotenv require
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Print token on successful authentication
  console.log(`Access token: ${accessToken}`);
  console.log(`Refresh token: ${refreshToken}`);
  console.log(`Profile: ${JSON.stringify(profile)}`);
}));