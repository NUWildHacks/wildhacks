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

// Application session logic
router.get('/application-session/exists/:email', function (req, res) {
  var email = req.params.email

  db.get(email, function (err, value) {
    if (err) res.json(false)
    res.json(value)
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

router.patch('/application-session/:hash', function (req, res) {
  var hash = req.params.hash
    , updates = req.body

  redirectIfInvalid(hash, res)

  db.get(hash, function (err, value) {
    if (err) res.json(err)

    for (var updatedField in updates) {
      value[updatedField] = updates[updatedField]
    }

    db.put(hash, value, function (err) {
      if (err) res.json(err)
      res.status(200).end()
    })
  })
})

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

router.put('/application-status', whTeamAuth, function (req, res) {
  var hash = req.params.hash
    , newStatuses = req.body

  db.get('statuses', function (err, statuses) {
    if (err) res.json(err)
    if (!statuses) statuses = { }
    for (var id in newStatuses) {
      statuses[id] = newStatuses[id];
    }
    db.put('statuses', statuses, function (err) {
      if (err) res.json(err)
      else res.status(200).end()
    })
  })
})

module.exports = router;
