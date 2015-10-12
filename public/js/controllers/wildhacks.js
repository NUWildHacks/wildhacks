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
          , userStatusIsValid = status == 'accepted'
                             || status == 'waitlist'
                             || status == 'rejected'
                             // || status == 'pending'
          , urlRoot = userStatusIsValid ? '/rsvp' : '/apply'
          // , urlRoot = '/apply'
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
wildhacks.controller('DashboardCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  // get all the applications
  $scope.loaded = false;
  $scope.numAccepted = 0;
  $scope.numApplications = 0;

  $http.get('/applications')
    .then(function success(res) {
      // populate the $scope variable with applications, adding validity and hash as properties (for later use)
      $scope.applications = [];
      angular.forEach(res.data, function(application, hash) {
        if (application['first-name']) {
          application.complete = appStatusUtils.isFinished(application);
          application.hash = hash;
          $http.get('/application-status/' + hash)
          .then(function success (res) {
            application.status = res.data || 'pending';
            $scope.applications.push(application);
            // populate the counters
            if (application.status === 'accepted') $scope.numAccepted++;
            $scope.numApplications++;
          });
        }
      });
      // now we're done, so do some housecleaning
      $scope.loaded = true;
      console.log(res.status);
    }, function error(res) {
      console.log(res.status);
    });

  // TOGGLE STATUS FUNCTION
  $scope.toggleStatus = function(application, status) {
    var data = { };
    data[application.hash] = status;
    application.status = status;

    $http.put('/application-status/', data)
      .then(function success(res) {
        console.log(res.status);
      }, function error(res) {
        console.log(res.status);
      });
  };

  // update numbers
  $scope.updateValue = function(newValue, oldValue) {
    if (newValue !== "accepted" && oldValue === "accepted") $scope.numAccepted--;
    if (newValue === "accepted" && oldValue !== "accepted") $scope.numAccepted++;
  };

  $scope.recount = function() {
    $timeout(function() {
      $scope.numApplications = $scope.filteredApps.length;
      $scope.numAccepted = 0;
      for (var i = 0; i < $scope.filteredApps.length; i++) {
        if ($scope.filteredApps[i].status === 'accepted') $scope.numAccepted++;
      }
    }, 1000);
  };

  
}]);

wildhacks.controller('RsvpCtrl', ['$scope', '$http', function($scope, $http) {

  var hash = window.location.hash.split(':')[1]

  if (!hash) window.location.href = '/'

  $http.get('/application-status/' + hash)
  .then(function success (res) {
    $scope.status = res.data
  })

  $http.get('/application-session/' + hash)
  .then(function success(res) {
    $scope.user = res.data;
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
