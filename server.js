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

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// view engine setup
app.set('views', __dirname + '/public/views');
app.engine('.html', require('ejs').renderFile);

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routes
var routes = require('./routes/index.js')(passport);
app.use('/', routes);

app.get('/signup', function(req, res) {
  res.render('signup.html');
});

app.listen(port);
console.log('LISTENING ON PORT: ' + port);
