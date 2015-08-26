// routes/server.js
var express = require('express');
var router = express.Router();

var isAuthenticated = function(req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

module.exports = function(passport) {
  
  // GET main page
  router.get('/', function(req, res) {
    res.render('index.html', { message: req.flash('message') });
  });
  
  // GET application page
  router.get('/apply', isAuthenticated, function(req, res) {
    res.render('apply.html', { user: req.user });
  });
  
  router.get('/signup', function(req, res) {
    res.render('signup.html');
  });
  
  // Handle login POST
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/apply',
    failureRedirect: '/',
    failureFlash: true
  }));
  
  // Handle registration POST
  router.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function () {
      console.log('passport custom callback!');
      console.log(arguments);
      res.send();
    })(req, res, next);
  });
  
  return router;
};