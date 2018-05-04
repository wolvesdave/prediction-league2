(function (angular) {
  // CONTROLLERS
var app = angular.module('predictionApp', []);

// CONTROLLERS

app.controller('prediction-controller', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In prediction-controller");

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {
        console.log(result);
        console.log($scope.user.email);
//        $scope.email = user.email;
        $scope.round = result.currentRound;
        $scope.month = result.currentMonth;

    $http.get('http://localhost:3000/api/get_predictions/'+$scope.user.email+'/'+$scope.round)
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
