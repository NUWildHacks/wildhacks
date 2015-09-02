var expressSession = require('express-session')
  , cookieParser   = require('cookie-parser')
  , methodOverride = require('method-override')
  , path           = require('path')
  , logger         = require('morgan')
  , bodyParser     = require('body-parser')
  , express        = require('express')

module.exports = function (app) {
  // view engine setup
  app.set('views', __dirname + '/../public/views');
  app.engine('.html', require('ejs').renderFile);

  app.use(logger('dev'));

  // NOTE(Jordan): Request data parsing
  app.use(cookieParser())
  app.use(methodOverride())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, '../public')));
}
