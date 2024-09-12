// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('./models/User'); // Correct path to User model

// passport.use(new GoogleStrategy({
//     clientID: 'YOUR_GOOGLE_CLIENT_ID',
//     clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
//     callbackURL: 'http://localhost:3000/auth/google/callback'
// },
// async (token, tokenSecret, profile, done) => {
//     try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//             console.log('profile', profile);
//             user = new User({
//                 googleId: profile.id,
//                 displayName: profile.displayName,
//                 email: profile.emails[0].value // Assuming email is returned
//             });
//             await user.save();
//         }
//         return done(null, user);
//     } catch (err) {
//         return done(err, false);
//     }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (err) {
//         done(err, false);
//     }
// });
