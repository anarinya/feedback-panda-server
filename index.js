const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

// Use port provided by heroku, or default to port 5000
const PORT = process.env.PORT || 5000;

// Grab environment variables -------------------------------------------
require('dotenv').config({ path: 'dev.env' });

////////////////////////////////////////////////////////////////////////
// Mongoose/MongoDB Setup
////////////////////////////////////////////////////////////////////////
// Mongoose deprecated their promise lib, set it to use es6 promises
mongoose.Promise = global.Promise;
// Connect to MongoDB
mongoose.connect(process.env.DEV_DB, { useMongoClient: true })
  // Show a success message once a connection is successfully established
  .then(() => console.log('⚡ Successfully connected to mongoDB.'))
  // Catch any connection errors
  .catch(err => console.error(`🔥 Error connecting to database: ${err}`));


// Import models ///////////////////////////////////////////////////////
require('./models/User');

////////////////////////////////////////////////////////////////////////
// App Setup
////////////////////////////////////////////////////////////////////////
const app = express();

// Setup Middleware ////////////////////////////////////////////////////
// Use cookie sessions middleware
app.use(cookieSession({
  // how long a cookie can exist before expiring (30 days)
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}));
// Tell passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

// Use passport services middleware
require('./services/passport');

// Setup Routes ////////////////////////////////////////////////////////
// Wrap authorization routes with app
require('./routes/auth')(app);

// Startup server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}.`);
});
