var wildhacks = angular.module('wildhacks', []);

wildhacks.controller('RegisterCtrl', ['$scope', '$http', function($scope, $http) {
  // if true, display the login page, otherwise display the registration page
  $scope.showRegister = true;
  
  $scope.register = function() {
    $http.post('/signup', $scope.user)
      .success(function(data) {
        console.log($scope.user);
        console.log("success");
      })
      .error(function(data, status, headers, config) {
        console.log(status);
      });
  };
  
  $scope.login = function() {
    $http.post('/login', $scope.user)
      .success(function(data) {
        console.log("success");
      })
      .error(function(data, status, headers, config) {
        console.log(status);
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
