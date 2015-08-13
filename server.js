// server.js
var express = require('express');
var path = require('path');
var favicon = require('favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 9000;

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

app.listen(port);
console.log('LISTENING ON PORT: ' + port);
