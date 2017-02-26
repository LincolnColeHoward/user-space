'use strict'
// user model
// use unique email and phone for account
// salt & hash password
// easy password check with user.comparePassword
let salt = require ('bcrypt-nodejs').genSalt;
let hash = require ('bcrypt-nodejs').hash;
let compare = require ('bcrypt-nodejs').compare;
// define User
let UserSchema = new mongoose.Schema ({
  // user.email
  email: {
    type: String,
    required: true,
    unique: true
  },
  // user.phone
  phone: {
    type: String,
    required: true,
    unique: true
  },
  // user.password
  password: {
    type: String,
    required: true
  }
});
// pre-save salt and hash
UserSchema.methods.hash = function (next) {
  let user = this;
  // bcrypt gen salt
  salt (10, (err, salt) => {
    if (err) return next (err);
    // bcrypt hash
    hash (user.password, salt, () => {}, (err, value) => {
      user.password = value;
      next ();
    });
  });
}
// verify password
UserSchema.methods.comparePassword = function (password, cb) {
  // bcrypt compare
  compare (password, this.password, (err, match) => {
    if (err) return cb (err);
    cb (null, match);
  });
}

module.exports = mongoose.model ('User', UserSchema);