const passport = require('passport');

module.exports = (app) => {
  // Pass requests to /auth/google to passport, tell it to use google auth
  app.get('/auth/google', passport.authenticate('google', {
    // Give us access to the google profile and email address
    scope: ['profile', 'email']
  }));

  // Landing route after authenticating with google
  app.get('/auth/google/callback', passport.authenticate('google'));
};