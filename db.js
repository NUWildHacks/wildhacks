var levelup = require('level')

var env = process.env.NODE_ENV
  , db

if (env == 'production') {
  db = levelup('db/prod')
} else {
  db = levelup('db/dev')
}

module.exports = db
