'use strict'
console.log ('inside passport local');
let localStrategy = require ('passport-local');
// create local strategy
passport.use (new localStrategy ({
  // email and phone needed
  passReqtoCallback: true
}, function (req, username, password, done) {
  User.findOne ({email: req.body.email, phone: req.body.phone}, (err, user) => {
    if (err) return done (err);
    if (!user) return done (null, false);
    user.comparePassword (password, (err, match) => {
      if (err) return done (err);
      if (!match) return done (null, false);
      //. okay... is all good!
      return done (null, user);
    });
  });
}))