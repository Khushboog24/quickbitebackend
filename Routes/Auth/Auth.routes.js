const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:4200/' }),
  (req, res) => {
    console.log('success');
    // Successful authentication, redirect home.
    res.redirect('http://localhost:4200/');
  });


module.exports = router;