const express = require('express');
// import initializePassport from './utils/passportsession';
const initializePassport = require('./utils/passportsession');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./utils/connectDB');
require('./auth'); // Ensure this path is correct
const restraurantRoutes = require('./Routes/Restaurants/Restaurants.routes.js');
const authRoutes = require('./Routes/Auth/Auth.routes.js');
const dotenv = require('dotenv');
const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
initializePassport(app);

app.use('/api/restaurants', restraurantRoutes);
app.use('/auth', authRoutes);



// Listen on port
app.listen(port, () => {
  connectDB().then(() => {
    console.log(`Server running at http://localhost:${port}`);
  }
  )
  .catch(err => {console.log(err);
    process.exit(1);
  });

});
