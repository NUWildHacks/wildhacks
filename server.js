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
mongoose.connect(process.env.MONGOLAB_URI || 'localhost:27017')

// app
var port = process.env.PORT || 9000;
var app = express();

// config
require('./config/app.js')(app);

// routes
app.use(require('./routes')())

app.listen(port);
console.log('LISTENING ON PORT: ' + port);
