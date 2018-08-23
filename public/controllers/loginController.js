// CONTROLLERS

predictionApp.controller('loginController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In loginController", $scope);

    // $scope.submit = function() {
    //   console.log("In Login submit");
    //
    //   data = {email: $scope.email, Round: $scope.round, predictions: $scope.predictions}
    //
    //   $http.post('http://localhost:3000/login/', data)
    //     .success(function (result) {
    //         console.log(result);
    //         $scope.predictions = result;
    //     })
    //     .error(function (data, status) {
    //         console.log(data);
    //   })
    //
    //   $http.get('http://localhost:3000/api/sysparms')
    //     .success(function (result) {
    //       $scope.currentRound = result.sysparms.currentRound;
    //       $scope.currentMonth = result.sysparms.currentMonth;
    //   })
    //     .error(function (data, status) {
    //         console.log(data);
    //   });
    //
    // };


}]);
