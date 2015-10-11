var wildhacks = angular.module('wildhacks', []);

wildhacks.controller('RegisterCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
  // if true, display the login page, otherwise display the registration page
  $scope.showRegister = true;

  $scope.authenticate = function() {
    var email = $scope.user.email;

    var key = sjcl.codec.utf8String.toBits($scope.user.email);
    var out = (new sjcl.misc.hmac(key, sjcl.hash.sha256)).mac($scope.user.password);
    var hash = sjcl.codec.hex.fromBits(out);

    $http.get('/application-session/exists/' + email)
      .then(function success (res) {
        var data = res.data;
        if (data && data != hash) {
          // There's already an application
          alert('It looks like you already have an application! Check your password and try again. If you are certain this is a mistake, email us at tech@nuisepic.com and we\'ll get you figured.');
        } else {
          var url = "/apply#" + email + ":" + hash;
          $window.location.href = url;
        }
      }, function failure (err) {
        alert('Whoops, something is very wrong. Try refreshing the page and trying again.');
      });
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


// dashboard controller
wildhacks.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('/applications')
    .then(function success(res) {
      $scope.data = [];
      $scope.acceptedCounter = 0;

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
      console.log($scope.data);
    }, function error(res) {
      console.log("failure");
    });

  $scope.searchTerm = "";
  $scope.toggle = function(applicant) {
    var data = {
      'users': [applicant.hash],
      'status': applicant.status
    };
    $http.put('/update-many/', data)
      .then(function success(res) {
        console.log(res);
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
