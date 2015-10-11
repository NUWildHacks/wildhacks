// routes/index.js
var express   = require('express')
  , router    = express.Router()
  , db        = require('../db.js')
  , basicAuth = require('basic-auth-connect')

router.get('/', function(req, res) {
  res.render('index.html');
});

router.get('/apply', function (req, res) {
  if (!req.query || typeof req.query.email === 'undefined' || typeof req.query.key === 'undefined') {
    res.redirect('/');
  }
  res.render('application.html');
});

router.get('/rsvp', function (req, res) {
  if (!req.query || typeof req.query.email === 'undefined' || typeof req.query.key === 'undefined') {
    res.redirect('/');
  }
  res.render('rsvp.html');
});

router.get('/applications',
           basicAuth('wh-team', process.env.REVIEW_PASSWORD),
           function (req, res) {
  var applications = { };
  db.createReadStream()
    .on('data', function (data) {
    applications[data.key] = data.value;
  }).on('end', function () {
    res.json(applications);
  });
});

router.get('/dashboard', basicAuth('wh-team', process.env.REVIEW_PASSWORD), function(req, res) {
  res.render('dashboard.html');
});

router.get('/application-session/exists/:email', function (req, res) {
  var email = req.params.email;
  db.get(email, function (err, value) {
    if (err) res.json(false);
    else res.json(value);
  });
});

router.get('/application-session/:hash', function (req, res) {
  var key = req.params.hash;
  db.get(key, function (err, value) {
    if (err) res.json({});
    else res.json(value);
  });
});

router.put('/application-session/:hash', function (req, res) {
  var key = req.params.hash
    , email = req.body.email
  req.body.status = 'pending';
  db.put(key, req.body, function (err) {
    if(err) res.json(err);
    else {
      db.put(email, key, function (err) {
        if (err) res.json(err);
        else res.send('okay!');
      });
    }
  });
});

router.put('/update-many/', basicAuth('wh-team', process.env.REVIEW_PASSWORD), function(req, res) {
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

router.get('/user/', function(req, res) {
  var key = req.body.key;
  db.get(key, function(err, user) {
    if (err) res.json(err);
    else {
      res.json(user);
    }
  });
});

router.put('/user/:hash', function(req, res) {
  var hash = req.params.hash;
  var user = req.body
  console.log(user);
  db.put(hash, user, function(err) {
    if (err) res.json(err)
    else {
      console.log('updated');
      res.json({'status': 'ok'});
    }
  });

});

module.exports = router;
