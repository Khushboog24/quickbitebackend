const express = require("express");
const initializePassport = require("../utils/passportsession.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("../utils/connectDB.js");
require("../auth.js");
const restraurantRoutes = require("../Routes/Restaurants/Restaurants.routes.js");
const authRoutes = require("../Routes/Auth/Auth.routes.js");
const menuRoutes = require("../Routes/Menus/Menus.routes.js");
const dotenv = require("dotenv");
const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
initializePassport(app);

app.use("/api/restaurants", restraurantRoutes);
app.use("/auth", authRoutes);
app.use("/api/menus", menuRoutes);

// Listen on port
app.listen(port, () => {
  connectDB()
    .then(() => {
      console.log(`Server running at http://localhost:${port}`);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
});
