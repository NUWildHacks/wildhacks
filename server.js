// server.js
var express = require('express');
var path = require('path');
var favicon = require('favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

var dbConfig = require('./config/db.js');
var mongoose = require('mongoose');

// set up DB
mongoose.connect(dbConfig.url);

// app
var port = process.env.PORT || 9000;
var app = express();

// view engine setup
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());

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

// routes
var routes = require('./routes/index')(passport);
app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);
console.log('LISTENING ON PORT: ' + port);
