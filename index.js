module.exports = {
  init: function (app, mongoose, passport, secret, uri) {
    global.mongoose = mongoose;
    global.User = require ('./models/User');
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
          maxAge: 1000 * 60 * 60 * 60 * 24 * 7
        },
        store: store
    }));
    require ('./config/passport');
    require ('./config/passportLocal');
    app.use (passport.initialize ());
    app.use (passport.session ());
    global.controllers = require ('./routes/userController');
  },
  api: require ('./api/user-space.js'),
  get userController () {
    return controllers.user_router;
  },
  get sessionController () {
    return controllers.session_router;
  },
  get User () {
    return User;
  }
}