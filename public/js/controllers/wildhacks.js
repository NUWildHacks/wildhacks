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
wildhacks.controller('DashboardCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
  $http.get('/applications')
    .then(function success(res) {
      $scope.data = [];
      $scope.acceptedCounter = 0;
      $scope.reverse = false;

      angular.forEach(res.data, function(element, key) {
        // assign a temporary variable for if the application is complete
        var finished = true;
        var numFinished = 0;
        if (!(element.email) && (Object.keys(element).length >= 17)) {
          numFinished += 1;
        } else if (element.email && (Object.keys(element).length > 17)) {
          numFinished += 1;
        } else {
          finished = false;
        }
        element.finished = finished;

        // store the hash in the object, for later
        element.hash = key;

        if (element.status === "accepted") {
          $scope.acceptedCounter += 1;
        }

        $scope.data.push(element);
      });
    }, function error(res) {
      console.log("failure");
    });

  var orderBy = $filter('orderBy');
  $scope.order = function(predicate, reverse) {
    $scope.data = orderBy($scope.data, predicate, reverse);
  };

  $scope.$watch('subset', function(newVal, oldVal) {
    if (!newVal) {
      return;
    }

    $scope.accepted = 0;
    for (var i = 0; i < newVal.length; i++) {
      if (newVal[i].status === 'accepted') {
        $scope.accepted++;
      }
    }
    $scope.applicants = newVal.length;
  });

  $scope.searchTerm = "";
  $scope.toggle = function(applicant) {
    var data = {
      'users': [applicant.hash],
      'status': applicant.status
    };
    $http.put('/update-many/', data)
      .then(function success(res) {
        console.log('updated!');
      }, function error(res) {
        console.log('error in update.');
      });
  };

  $scope.acceptAll = function() {
    var data = {
      'users': [],
      'status': 'accepted'
    };
    angular.forEach($scope.subset, function(applicant, index) {
      applicant.status = "accepted";
      data.users.push(applicant.hash);
    });

    $http.put('/update-many/', data)
      .then(function success(res) {
        console.log('updated!');
      }, function error(res) {
        console.log('error in update.');
      });
  };
}]);

wildhacks.controller('RsvpCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
  var url = $window.location.href;
  var params = parseUrlParams(url);
  $scope.restrictions = '';
  var user;
  $http.get('/application-session/' + params.hash)
    .then(function success(response) {
      user = response.data;
      $scope.status = user.status;

    }, function error(response) {
      $scope.status = 'waitlist';
    });

  $scope.submitRsvp = function(status) {
    var data = user;
    data.rsvp = status
    $http.put('/application-session/' + params.hash, data)
      .then(function success(response) {
        console.log('RSVPed!');
        if (status === 'not coming') {
          alert('We\'ll miss you!');
          $window.location.href = '/';
        }
      }, function error(response) {
        console.log('RSVP failed!');
      }
    );
  }

  $scope.submitDietaryRestrictions = function(restrictions) {
    var data = user;
    data.dietaryRestrictions = restrictions;
    $http.put('/application-session/' + params.hash, data)
      .then(function success(response) {
        alert('Thanks! Looking forward to seeing you!');
        $window.location.href = '/';
        console.log('Dietary restrictions saved!');
      }, function error(response) {
        console.log('Dietary restrictions not saved!');
      });
  }
}]);
