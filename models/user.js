// models/user.js
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
  email: String,
  cell: String,
  dietaryRestrictions: String,
  shirtSize: String,
  name: {
    firstName: String,
    lastName: String
  },
  education: {
    school: String,
    major: String,
    graduation: {
      month: Number,
      year: Number
    }
  },
  career: {
    lookingFor: String,     // FTE, Internship, Part-time, or Not Interested
    // resume: File,        // How do I do this
    interests: Array
  },
  links: {
    github: String,
    linkedin: String,
    devpost: String,
    other: String
  },
  demographic: {
    race: String,
    gender: String,
    firstHackathon: Boolean
  },
  travel: {
    needReimbursement: Boolean,
    city: String,
    state: String
  },
  favoriteProject: String,
  other: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
