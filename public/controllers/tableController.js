// CONTROLLERS

predictionApp.controller('tableController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In tableController", $scope);
    $scope.userMessage = "Welcome"

    $scope.changeMonth = function() {
      console.log("In changeMonth", $scope.month);
    };

    $http.get('http://localhost:3000/api/get_scores')
      .success(function (result) {
        $scope.results = result;
    });
}]);
 
