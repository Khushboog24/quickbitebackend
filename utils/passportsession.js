const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.js"); // Correct path to User model
const session = require("express-session");
const env = require("dotenv").config().parsed;
// Initialize Passport for Google OAuth2 authentication
const initializePassport = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  console.log("env passportsessionquickbit",!!env.GOOGLE_CLIENT_ID, !!process.env.GOOGLE_CLIENT_ID);
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);
          if (!profile) {
            return done(new Error("Profile data not received"));
          }

          // Check if the user already exists
          let user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user);
          } else {
            // If user does not exist, create a new user
            user = await User.create({
              displayName: profile.name.givenName,
              email: profile.emails[0].value,
              isVerified: true,
            });
            return done(null, user);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

// Export the initializePassport function using CommonJS syntax
module.exports = initializePassport;
