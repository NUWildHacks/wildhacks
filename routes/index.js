// routes/index.js
var express   = require('express')
  , router    = express.Router()
  , db        = require('../db.js')
  , basicAuth = require('basic-auth-connect')

var whTeamAuth = basicAuth('wh-team', process.env.REVIEW_PASSWORD)

function redirectIfInvalid (hash, res) {
  if (!hash) {
    res.redirect('/')
  }
}

// Views

router.get('/', function(req, res) {
  res.render('index.html');
});

router.get('/apply', function (req, res) {
  res.render('application.html');
});

router.get('/rsvp', function (req, res) {
  res.render('rsvp.html');
});

router.get('/dashboard', whTeamAuth, function(req, res) {
  res.render('dashboard.html');
});

// Admin Logic

router.get('/applications', whTeamAuth, function (req, res) {
  var applications = { };
  db.createReadStream()
    .on('data', function (data) {
    applications[data.key] = data.value;
  }).on('end', function () {
    res.json(applications);
  });
});

router.put('/update-many/', whTeamAuth, function(req, res) {
  var status = req.body.status;
  var keyList = req.body.users;
  for (var i = 0; i < keyList.length; i++) {
    var key = keyList[i];
    db.get(keyList[i], function(err, object) {
      if (err) res.json(err);
      else {
        object['status'] = status;
        db.put(key, object, function(err) {
          if (err) {
            res.json(err);
          } else {
            res.json({'status': 'ok'});
          }
        });
      }
    });
  }
});

// Generic application logic

router.get('/application-session/:hash', function (req, res) {
  var hash = req.params.hash

  redirectIfInvalid(hash, res)

  db.get(hash, function (err, value) {
    if (err) res.json({});
    else res.json(value);
  });
});

router.put('/application-session/:hash', function (req, res) {
  var hash = req.params.hash
    , email = req.body.email

  redirectIfInvalid(hash, res)

  db.put(hash, req.body, function (err) {
    if(err) res.json(err);
    else {
      db.put(hash, key, function (err) {
        if (err) res.json(err);
        else res.send('okay!');
      });
    }
  });
});

module.exports = router;
