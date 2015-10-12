var rsvpRequired = [
  'rsvp'
];

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
  'why-do-you-want-to-come',
  'last_cache_time'
];

var optionalFields = [
  'github',
  'website',
  'resume',
  'teammates',
  'dietaryRestriction',
  'waitlist-rsvp'
];

var allowedFields =
    [].concat(optionalFields)
      .concat(applicationRequired)
      .concat(rsvpRequired);

var appStatusUtils;

if (typeof module === 'object' && module.exports) {
  appStatusUtils = module.exports;
} else {
  appStatusUtils = this.appStatusUtils = { }; // NOTE(jordan): this === window
}

// check if every field in applicationRequired exists in the application
function allFieldsDefined (data, fields) {
  return fields.every(function (f) {
    return data[f] !== undefined;
  });
}

// check if every field in an application is also in allowedFields
appStatusUtils.isValid = function (appData) {
  return Object.keys(appData).every(function (k) {
    return !!~allowedFields.indexOf(k);
  });
};

// all required app fields truthy
appStatusUtils.isFinished = function (appData) {
  console.log('testing');
  return appStatusUtils.isValid(appData) && allFieldsDefined(appData, applicationRequired);
};

// all required rsvp fields truthy
appStatusUtils.hasRSVPed = function (appData) {
  return appStatusUtils.isValid(appData) && allFieldsDefined(appData, rsvpRequired);
};
