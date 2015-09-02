var levelup = require('level')

var env  = process.env.NODE_ENV || 'development'
  , opts = { valueEncoding: 'json' }
  , db   = levelup('db/' + env, opts);

module.exports = db
