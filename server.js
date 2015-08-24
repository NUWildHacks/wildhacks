// server.js
var express = require('express');
var path = require('path');
var favicon = require('favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 9000;

// set up DB
mongoose.connect(dbConfig.url);

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// view engine setup
app.set('views', __dirname + '/public/views');
app.engine('.html', require('ejs').renderFile);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/signup', function(req, res) {
  res.render('signup.html');
});

app.listen(port);
console.log('LISTENING ON PORT: ' + port);
