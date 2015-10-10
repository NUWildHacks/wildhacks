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
  $http.get('./js/controllers/applications.json')
    .then(function success(res) {
      $scope.data = [];
      id = 0;
      angular.forEach(res.data, function(element, key) {
        element.hash = key;
        $scope.data.push(element);
      });
    }, function error(res) {
      console.log("failure");
    });

  $scope.searchTerm = "";
  $scope.toggle = function(applicant) {
    console.log(applicant);
  };

}]);
