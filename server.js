// server.js
var express = require('express');
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
