// routes/server.js
var express = require('express')
  , router  = express.Router()
  , db      = require('../db.js')

router.get('/', function(req, res) {
  res.render('index.html')
});

router.get('/apply', function (req, res) {
  res.render('application.html')
});

router.get('/application-session/:hash', function (req, res) {
  var key = req.params.hash
  db.get(key, function (err, value) {
    if (err) res.send({})
    else res.send(value);
  })
});

router.put('/application-session/:hash', function (req, res) {
  var key = req.params.hash
  db.put(key, req.body, function (err, value) {
    if(err) console.error(err)
    else res.send('okay!')
  })
});

module.exports = router;
