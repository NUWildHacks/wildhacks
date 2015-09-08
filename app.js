// server.js
var express = require('express');

require('dotenv').load()

// app
var port = process.env.PORT || 9999;
var app = express();

// config
require('./config/app.js')(app);

// routes
app.use(require('./routes'))

app.listen(port);
console.log('LISTENING ON PORT: ' + port);
