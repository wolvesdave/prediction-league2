(function (angular) {
  // CONTROLLERS
var app = angular.module('predictionApp', []);

// CONTROLLERS

app.controller('closeRoundController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

  console.log("In closeRoundController");

  $http.get('http://localhost:3000/api/sysparms')
    .success(function (result) {

      $scope.email = result.email;
      $scope.round = result.currentRound;
      $scope.month = result.currentMonth;

  $http.get('http://localhost:3000/api/get_table',)
    .success(function (result) {

        $scope.users = result;
        console.log("Here's the gibber" );

    })
    .error(function (data, status) {

        console.log(data);

  });
});
}]);
}(angular));
