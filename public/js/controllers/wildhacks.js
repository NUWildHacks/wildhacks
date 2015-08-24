var wildhacks = angular.module('wildhacks', []);

wildhacks.controller('RegisterCtrl', ['$scope', function($scope) {
  // if true, display the login page, otherwise display the registration page
  $scope.showRegister = true;
  
  $scope.register = function() {
    alert("client-side checks passed for registration");
  };
  
  $scope.login = function() {
    alert("client-side checks passed for login");
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
