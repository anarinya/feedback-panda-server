const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Environment variables
const PORT = process.env.PORT || 5000;
require('dotenv').config({ path: 'dev.env' });

// Create new application
const app = express();
// Setup middleware
// Setup PassportJS Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Print token on successful authentication
  console.log(`Access token: ${accessToken}`);
  console.log(`Refresh token: ${refreshToken}`);
  console.log(`Profile: ${JSON.stringify(profile)}`);
}));
// Pass requests to /auth/google to passport, tell it to use google auth
app.get('/auth/google', passport.authenticate('google', {
  // Give us access to the google profile and email address
  scope: ['profile', 'email']
}));
// Landing route after authenticating with google
app.get('/auth/google/callback', passport.authenticate('google'));


app.listen(PORT, () => {
  console.log(`Panda server running on port ${PORT}`);
});
