(function (angular) {
  // CONTROLLERS
var app = angular.module('predictionApp', []);

// CONTROLLERS

app.controller('tableController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

  console.log("In tableController");

  $http.get('http://localhost:3000/api/sysparms')
    .success(function (result) {

      $scope.email = result.email;
      $scope.round = result.currentRound;
      $scope.month = result.currentMonth;

  $http.get('http://localhost:3000/api/get_table',)
    .success(function (result) {

        $scope.users = result;

    })
    .error(function (data, status) {

        console.log(data);

  });
});
}]);
}(angular));
