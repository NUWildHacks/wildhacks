var passport       = require('passport')
  , expressSession = require('express-session')
  , cookieParser   = require('cookie-parser')
  , methodOverride = require('method-override')
  , path           = require('path')
  , favicon        = require('favicon')
  , logger         = require('morgan')
  , bodyParser     = require('body-parser')
  , express        = require('express')
  , flash          = require('connect-flash')
  , User           = require('../models/user.js')

module.exports = function (app) {
  // view engine setup
  app.set('views', __dirname + '/../public/views');
  app.engine('.html', require('ejs').renderFile);

  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));

  // NOTE(Jordan): Request data parsing
  app.use(cookieParser())
  app.use(methodOverride())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  // Configuring Passport
  app.use(expressSession({secret: 'mySecretKey'}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  // Initialize Passport
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(express.static(path.join(__dirname, '../public')));
}
