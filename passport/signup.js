// passport/register.js

var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  passport.use('signup', new LocalStrategy({
    passReqToCallBack: true
  },
  function(req, email, password, done) {
    findOrCreateUser = function() {
      // find a user in Mongo with the provided email
      User.findOne({ 'email': email }, function(err, user) {
        if (err) {
          console.log("Error in signup: " + err);
          return done(err);
        }
        
        if (user) {
          console.log("User already exists");
          return done(null, false, 
            req.flash('message', "User already exists"));
        } else {
          newUser.email = email;
          newUser.password = createHash(password);
          
          // save the user
          newUser.save(function(err) {
            if (err) {
              console.log("Error in saving user: " + err);
              throw err;
            }
            console.log("Great success");
            return done(null, newUser);
          });
        }
      });  
    };
    
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));
  
  var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};