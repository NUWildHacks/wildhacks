var wildhacks = angular.module('wildhacks', []);

function parseUrlParams(url) {
  var index = url.indexOf('email') + 6;
  var email = '';
  for (var i = index; i < url.length; i++) {
    if (url[i] === '&') {
      break;
    }
    email += url[i];
  }


  index = url.indexOf('key') + 4;
  var hash = '';
  for (var i = index; i < url.length; i++) {
    if (url[i] == '#') {
      break;
    }
    hash += url[i]
  }

  return {
    'email': email,
    'hash': hash
  };
}

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
        var data = res.data;
        if (data && data != hash) {
          // There's already an application
          alert('It looks like you already have an application! Check your password and try again. If you are certain this is a mistake, email us at tech@nuisepic.com and we\'ll get you figured.');
        } else {
          var urlRoot;
          console.log(hash);
          var user = $http.get('/application-session/' + hash);
          console.log(user)
          if (user.status === 'accepted' || user.status === 'rejected' || user.status === 'waitlist') {
            urlRoot = '/rsvp';
          } else {
            urlRoot = '/apply';
          }
          var url = urlRoot + '?email=' + email + '&key=' + hash;
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
      id = 0;
      angular.forEach(res.data, function(element, key) {
        element.hash = key;
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
    $http.put('/user/' + params.hash, data)
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
    $http.put('/user/' + params.hash, data)
      .then(function success(response) {
        alert('Thanks! Looking forward to seeing you!');
        $window.location.href = '/';
        console.log('Dietary restrictions saved!');
      }, function error(response) {
        console.log('Dietary restrictions not saved!');
      });
  }
}]);
