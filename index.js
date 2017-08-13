const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Use port provided by heroku, or default to port 5000
const PORT = process.env.PORT || 5000;

// Grab environment variables -------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'dev.env' });
} 

////////////////////////////////////////////////////////////////////////
// Mongoose/MongoDB Setup
////////////////////////////////////////////////////////////////////////
// Mongoose deprecated their promise lib, set it to use es6 promises
mongoose.Promise = global.Promise;
// Connect to MongoDB
mongoose.connect(process.env.DEV_DB_ATLAS, { useMongoClient: true })
  // Show a success message once a connection is successfully established
  .then(() => console.log('⚡ Successfully connected to mongoDB.'))
  // Catch any connection errors
  .catch(err => console.error(`🔥 Error connecting to database: ${err}`));


// Import models ///////////////////////////////////////////////////////
require('./models/User');
require('./models/Survey');

////////////////////////////////////////////////////////////////////////
// App Setup
////////////////////////////////////////////////////////////////////////
const app = express();

// Setup Middleware ////////////////////////////////////////////////////
app.use(cors());
// parses incoming requests and attaches them to req.body
app.use(bodyParser.json());
// Use morgan for enhanced logging
app.use(morgan('combined'));
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
require('./routes/billing')(app);
require('./routes/surveys')(app);

// Setup production asset handling and unhandled routes
if (process.env.NODE_ENV === 'production') {
  // If we don't have a matching requested route, look in this dir
  app.use(express.static('client/build'));
  // Use index.html if route isn't recognized (route catchall)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Startup server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}.`);
});
