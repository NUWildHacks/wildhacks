var rsvpRequired = [
  'rsvp'
]

var applicationRequired = [
  'first-name',
  'last-name',
  'school',
  'year',
  'major',
  'travel',
  'gender',
  'shirt',
  'hackathons',
  '18yet',
  'mlh-code-of-conduct',
  'why-do-you-want-to-come'
]

var optionalFields = [
  'github',
  'website',
  'teammates',
  'dietaryRestriction',
  'waitlist-rsvp'
]

var allowedFields =
    [].concat(optionalFields)
      .concat(applicationRequired)
      .concat(rsvpRequired)

var appStatusUtils;

if (typeof module === 'object' && module.exports) {
  appStatusUtils = module.exports
} else {
  appStatusUtils = this.appStatusUtils // NOTE(jordan): this === window
}

function allFieldsTruthy = function (data, fields) {
  return fields.every(function (f) {
    return !!data[f]
  })
}

// only allowedFields
appStatusUtils.isValid = function (appData) {
  return Object.keys(appData).every(function (k) {
    return !!~allowedFields.indexOf(k)
  })
}

// all required app fields truthy
appStatusUtils.isFinished = function (appData) {
  return appStatusUtils.isValid(appData)
         && allFieldsTruthy(appData, applicationRequired)
}

// all required rsvp fields truthy
appStatusUtils.hasRSVPed = function (appData) {
  return appStatusUtils.isValid(appData)
         && allFieldsTruthy(appData, rsvpRequired)
}
