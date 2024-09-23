const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.js"); // Correct path to User model
const session = require("express-session");
const MongoStore = require("connect-mongo"); // For session storage in MongoDB
require("dotenv").config(); // Load environment variables from .env file

// Initialize Passport for Google OAuth2 authentication
const initializePassport = (app) => {
  // Ensure Google OAuth credentials are available
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Google OAuth credentials are missing. Check your environment variables."
    );
  }

  // Configure express-session with MongoDB session store
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your_random_secret_key', // Use secret from env
      resave: false,
      saveUninitialized: false, // Only save session when necessary
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      },
      store: MongoStore.create({
        mongoUrl: 'mongodb+srv://khushboo15624:f3ti1fD7Tiv9Dkga@quickbite.ag6cw.mongodb.net/?retryWrites=true&w=majority&appName=quickbite', // MongoDB URL
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
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/auth/google/callback", // Callback URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google profile received:", profile);

          if (!profile) {
            return done(new Error("Profile data not received from Google"));
          }

          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user); // Existing user found
          } else {
            // Create a new user if none exists
            user = await User.create({
              displayName: profile.name.givenName,
              email: profile.emails[0].value,
              isVerified: true,
            });
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialize user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session using user ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

// Export the initializePassport function
module.exports = initializePassport;
