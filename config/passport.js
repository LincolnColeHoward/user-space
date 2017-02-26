'use strict'
let User = require ('../models/user');
passport.serializeUser (function (user, done) {
  done (null, user._id);
});

passport.deserializeUser (function (id, done) {
  User.findById (id, function (err, user) {
    done (err, user);
  });
});
