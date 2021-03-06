'use strict'
let session_router = require ('express').Router ();
let user_router = require ('express').Router ();
let bodyParser = require ('body-parser');
let zxcvbn = require ('zxcvbn');
let email = require ('validator').isEmail;
let phone = require ('validator').isMobilePhone;

session_router.use (bodyParser.json ());
user_router.use (bodyParser.json ());

function bypass (req, res, next) {
  if (req.user) return res.status (404).json (new Error ('already logged in'));
  next ();
}

user_router.post ('/users', bypass, (req, res) => {
  let error = false;
  let errorMessage = {};
  let obj = {};
  if (!email (req.body.email)) {
    error = true;
    errorMessage.email = 'invalid';
  } else {
    obj.email = req.body.email;
  }
  if (!phone (req.body.phone, 'en-US')) {
    error = true;
    errorMessage.phone = 'invalid US number';   
  } else {
    obj.phone = req.body.phone;
  }
  let score = zxcvbn (req.body.password).score;
  if (score !== 4) {
    error = true;
    errorMessage.password = 'not strong';
    errorMessage.password_score = score;
  } else {
    obj.password = req.body.password;
  }
  if (error)
    return res.status (400).json (errorMessage);
  let user = new User (obj);
  user.hash (() => {
    user.save ((err) => {
      if (err)
        return res.status (500);
      req.login (user, (err) => {
        if (err)
          return res.status (500);
        res.status (201).json ({email: user.email, phone: user.phone});
      });
    });
  });
});

session_router.get ('/sessions', (req, res) => {
  res.status (200).json (!!req.user);
})

session_router.post ('/sessions', bypass, passport.authenticate ('local'), (req, res) => {
  if (req.user) return res.status (201).json ({success: true});
  res.status (401).json ({success: false});
});

session_router.delete ('/sessions', (req, res) => {
  req.session.destroy ((err) => {
    res.status (200).json ({success: true});
  });
});

exports.user_router = user_router;
exports.session_router = session_router;