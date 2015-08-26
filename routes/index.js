// routes/server.js
var express  = require('express');
var passport = require('passport');
var router   = express.Router();
var User     = require('../models/user.js');
var _        = require('lodash');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  console.log('isAuthenticated being called')
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
};

module.exports = function() {

  // GET main page
  router.get('/', function(req, res) {
    res.render('index.html', { message: req.flash('message') });
  });

  router.get('/login', function (req, res) {
    res.render('login.html');
  })

  // GET application page
  router.get('/apply', isAuthenticated, function(req, res) {
    res.render('apply.html', { user: req.user });
  });

  router.get('/signup', function(req, res) {
    res.render('signup.html');
  });

  var handleError = function (res, success) {
    return function (err, resp) {
      if (err) res.send(err);
      else success(resp);
    }
  }

  var LogIn = passport.authenticate('local');

  // Handle registration POST
  router.post('/signup', function (req, res) {
    var user = _.pick(req.body, [ 'username' ])
    User.register(user, req.body.password,
                  handleError(res, function (user) {
      LogIn(req, res, function ( ) {
        // req.isAuthenticated() => true
        res.send('Registration Successful. See you at WH 2015!');
      })
    }))
  })

  router.get('/user/:username', function (req, res) {
    User.find({ username: req.params.username },
              handleError(res, function (user) {
      res.send(user)
    }))
  })

  return router;
};
