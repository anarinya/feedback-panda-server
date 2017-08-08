const passport = require('passport');

module.exports = app => {
  // Pass requests to /auth/google to passport, tell it to use google auth
  app.get('/auth/google', passport.authenticate('google', {
    // Give us access to the google profile and email address
    scope: ['profile', 'email']
  }));

  // Landing route after authenticating with google
  // passport.authenticate is a middleware
  app.get('/auth/google/callback', 
    passport.authenticate('google'), 
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  // Sign out route
  app.get('/api/logout', (req, res) => {
    const currentUser = req.user;
    // logout() is attached to the request object, automatically by passport
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};