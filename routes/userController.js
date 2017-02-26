'use strict'
let router = require ('express').Router ();
let User = require ('../models/user');
let bodyParser = require ('body-parser');
let owasp = require('owasp-password-strength-test').test;
let email = require ('validator').isEmail;
let phone = require ('validator').isMobilePhone;

router.post ('/users', bodyParser.json (), (req, res) => {
  let error = false;
  let errorMessage = {};
  let obj = {};
  if (!owasp (req.body.password).strong) {
    error = true;
    errorMessage.password = 'not strong';
  } else {
    obj.password = req.body.password;
  }
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
  if (error)
    return res.status (400).json (errorMessage);
  let user = new User (obj).save ((err) => {
    if (err)
      return res.status (500);
    req.login (user, (err) => {
      if (err)
        return res.status (500);
      res.status (201).json ({email: user.email, phone: user.phone});
    });
  });
});

router.post ('/sessions', bodyParser.json (), passport.authenticate ('local'), (req, res) => {
  if (req.user) return res.redirect ('/');
  res.json ({success: false});
});

router.delete ('/sessions', (req, res) => {
  req.session.destroy ();
  res.redirect ('/');
});

module.exports = router;