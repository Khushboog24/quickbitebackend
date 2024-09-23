const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const initializePassport = (app) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials are missing. Check your environment variables.");
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your_random_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      },
      store: MongoStore.create({
        mongoUrl: 'mongodb+srv://khushboo15624:f3ti1fD7Tiv9Dkga@quickbite.ag6cw.mongodb.net/?retryWrites=true&w=majority&appName=quickbite&tls=true&ssl=true',
        collectionName: 'sessions',
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  console.log("Environment variables loaded:", {
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google profile received:", profile);

          if (!profile) {
            return done(new Error("Profile data not received from Google"));
          }

          let user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user);
          } else {
            user = await User.create({
              displayName: profile.name.givenName,
              email: profile.emails[0].value,
              isVerified: true,
            });
            return done(null, user);
          }
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error during user deserialization:", error);
      done(error);
    }
  });
};

module.exports = initializePassport;
