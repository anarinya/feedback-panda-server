const express = require('express');

// Use port provided by heroku, or default to port 5000
const PORT = process.env.PORT || 5000;

// Grab environment variables
require('dotenv').config({ path: 'dev.env' });

// Create new application
const app = express();

// Setup middleware
// Use passport services middleware
require('./services/passport');

// Setup routes
// Wrap authorization routes with app
require('./routes/auth')(app);

// Startup server
app.listen(PORT, () => {
  console.log(`Panda server running on port ${PORT}`);
});
