var wildhacks = angular.module('wildhacks', []);

wildhacks.controller('RegisterCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
  // if true, display the login page, otherwise display the registration page
  $scope.showLogin = true;

  $scope.authenticate = function() {
    var email = $scope.user.email;

    var key = sjcl.codec.utf8String.toBits($scope.user.email);
    var out = (new sjcl.misc.hmac(key, sjcl.hash.sha256)).mac($scope.user.password);
    var hash = sjcl.codec.hex.fromBits(out);

    $http.get('/application-session/exists/' + email)
    .then(function success (res) {
      var exists = res.data
      console.log(exists)
      if (exists && hash != exists) {
        alert('It looks like you already have an application!' +
              ' Check your password and try again. If you are certain' +
              ' this is a mistake, email us at tech@nuisepic.com and' +
              ' we\'ll get you figured.');
      } else {
        $http.get('/application-status/' + hash)
        .then(function success (res) {
          var status = res.data
          , userStatusIsValid = status == 'pending'
                             || status == 'accepted'
                             || status == 'waitlist'
                             || status == 'rejected'
          , urlRoot = userStatusIsValid ? '/rsvp' : '/apply'
          , url = urlRoot + '#' + email + ':' + hash
          $window.location.href = url;
        })
      }
    })
  };

}]);

// Used for password validation on registration page
wildhacks.directive('equals', function() {
  return {
    //restrict: 'A',  // attribute only
    require: '?ngModel',  // get ngModelController
    link: function(scope, elem, attrs, ngModel) {
      if (!ngModel) return;

      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      attrs.$observe('equals', function(val) {
        validate();
      });

      var validate = function() {
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;
        ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
      };
    }
  };
});


// DASHBOARD CONTROLLER
wildhacks.controller('DashboardCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
  // CONSTRUCTOR FUNCTIONS
  var isComplete = function(application) {
    return !!(application['first-name'] &&
            application['last-name'] &&
            application.school &&
            application.year &&
            application.major &&
            application.travel &&
            application.gender &&
            application.shirt &&
            application.hackathons &&
            application['18yet'] &&
            application['mlh-code-of-conduct'] &&
            application['why-do-you-want-to-come']);
  };

  // first request GETs the statuses of all the applications
  $http.get('/application-status')
    .then(function success(res) {
      $scope.statuses = res.body;
      console.log(res.status);
    }, function error(res) {
      console.log(res.status);
    });

  // second request GETs all the applications themselves, modifying them a little
  $http.get('/applications')
    .then(function success(res) {
      // populate the $scope variable with applications, adding validity and hash as properties (for later use)
      $scope.applications = [];
      angular.forEach(res.data, function(application, hash) {
        application.complete = isComplete(application);
        application.hash = hash;
        $scope.applications.push(application);
      });
      console.log(res.status);
    }, function error(res) {
      console.log(res.status);
    });

  // TOGGLE STATUS FUNCTION
  $scope.toggleStatus = function(application, status) {
    var data = {
      'users': [application.hash],
      'status': status || application.status
    };
    $http.put('/update-many/', data)
      .then(function success(res) {
        console.log(res.status);
      }, function error(res) {
        console.log(res.status);
      });
  };

  // ACCEPT ALL BUTTON FUNCTION
  $scope.acceptAll = function() {
    console.log("its happening");
    angular.forEach($scope.filteredApps, function(application, idx) {
      application.status = 'accepted';
      $scope.toggleStatus(application, 'accepted');
    });
  };

  $scope.$watch('filteredApps', function(newVal) {
    if (!newVal) return;
    $scope.numApplications = newVal.length;
    $scope.numAccepted = 0;
    for (var i = 0; i < newVal.length; i++) {
      if (newVal[i].status === 'accepted') {
        $scope.numAccepted++;
      }
    }
  }, true);
}]);

wildhacks.controller('RsvpCtrl', ['$scope', '$http', function($scope, $http) {

  var hash = window.location.hash.split(':')[1]

  if (!hash) window.location.href = '/'

  $http.get('/application-status/' + hash)
  .then(function success (res) {
    $scope.status = res.data
  })

  $scope.submitRsvp = function(response) {
    var data = { rsvp: response }

    $http.patch('/application-session/' + hash, data)
    .then(function success (res) {
      console.log('RSVPed!')
      if (response === 'not coming') {
        alert('We\'ll miss you!')
        window.location.href = '/'
      }
    }, function error(res) {
      console.log('RSVP failed!')
    })
  }

  $scope.submitDietaryRestrictions = function(restrictions) {
    var data = { dietaryRestrictions: restrictions }
    $http.patch('/application-session/' + hash, data)
    .then(function success(response) {
      alert('Thanks! We\'ll make sure to accommodate your needs. :)');
      console.log('Dietary restrictions saved!');
    }, function error(response) {
      console.log('Dietary restrictions not saved!');
    });
  }
}]);
