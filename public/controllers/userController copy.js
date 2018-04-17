(function (angular) {
  // CONTROLLERS
var app = angular.module('predictionApp', []);
app.controller('userController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In userController");

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {

        $scope.email = result.email;
        $scope.round = result.currentRound;
        $scope.month = result.currentMonth;

    $http.get('http://localhost:3000/api/get_user/'+$scope.email+'/'+$scope.month)
        .success(function (result) {

            $scope.user = result[0];

        })
        .error(function (data, status) {

            console.log(data);

        });
    });
}]);
}(angular));
