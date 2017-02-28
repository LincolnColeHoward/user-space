exports.init = function (app, mongoose, passport, secret, uri) {
  global.mongoose = mongoose;
  global.passport = passport;
  let session = require ('express-session');
  let MongoStore = require ('connect-mongo') (session);
  let store = new MongoStore ({
    url: uri
  });
  app.use (session ({
      secret: secret,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 24 * 2
      },
      store: store
  }));
  require ('./config/passport');
  require ('./config/passportLocal');
  app.use (passport.initialize ());
  app.use (passport.session ());
  app.use (require ('./routes/userController'));
  return require ('./models/user');
}
exports.api = require ('./api/user-space.js');