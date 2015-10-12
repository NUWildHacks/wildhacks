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

// Application session logic
router.get('/application-session/exists/:email', function (req, res) {
  var email = req.params.email

  db.get(email, function (err, value) {
    if (err) res.json(false)
    res.json(true)
  })
})

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
      db.put(email, hash, function (err) {
        if (err) res.json(err);
        else res.send('okay!');
      });
    }
  });
});

// Application status logic

router.get('/application-status/:hash', function (req, res) {
  var hash = req.params.hash

  if (!hash)
    res.status(422).send('Hash no good.')

  db.get('statuses', function (err, statuses) {
    if (err) res.json(err)
    else res.json(statuses[hash])
  })
})

router.put('/application-status/:hash', whTeamAuth, function (req, res) {
  var hash = req.params.hash
    , status = req.body.status

  if (!hash)
    res.status(422).send('Hash no good.')

  db.get(hash, function (err, value) {
    if (err) res.status(400).send('Applicant ID does not exist.')
    db.get('statuses', function (err, statuses) {
      if (err) res.json(err)
      if (!statuses) statuses = { }
      statuses[hash] = status
      db.put('statuses', statuses, function (err) {
        if (err) res.json(err)
        else res.status(200).end()
      })
    })
  })
})

module.exports = router;
