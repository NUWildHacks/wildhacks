// routes/server.js
var express   = require('express')
  , router    = express.Router()
  , db        = require('../db.js')
  , basicAuth = require('basic-auth-connect')

router.get('/', function(req, res) {
  res.render('index.html')
});

router.get('/apply', function (req, res) {
  res.render('application.html')
});

router.get('/applications',
           basicAuth('wh-team', process.env.REVIEW_PASSWORD),
           function (req, res) {
  var applications = { };
  db.createReadStream()
    .on('data', function (data) {
    applications[data.value[data.key]] = data.value;
  }).on('end', function () {
    res.json(applications);
  });
});

router.get('/application-session/:hash', function (req, res) {
  var key = req.params.hash
  db.get(key, function (err, value) {
    console.log(value);
    if (err) res.json({})
    else res.json(value);
  })
});

router.put('/application-session/:hash', function (req, res) {
  var key = req.params.hash
  console.log(req.body)
  db.put(key, req.body, function (err) {
    if(err) res.json(err)
    else res.send('okay!')
  })
});

module.exports = router;
