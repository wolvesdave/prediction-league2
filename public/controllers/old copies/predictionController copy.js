(function (angular) {
  // CONTROLLERS
var app = angular.module('predictionApp', []);

// CONTROLLERS

app.controller('predictionController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In predictionController");

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {

        $scope.email = result.email;
        $scope.round = result.currentRound;
        $scope.month = result.currentMonth;

    $http.get('http://localhost:3000/api/get_predictions/'+$scope.email+'/'+$scope.round)
      .success(function (result) {

          console.log(result);
          $scope.predictions = result;

      })
      .error(function (data, status) {

          console.log(data);

    });
});
}]);
}(angular));
