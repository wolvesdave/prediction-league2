// CONTROLLERS

predictionApp.controller('predictionController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In predictionController", $scope);

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {

        $scope.email = result.user;
        $scope.round = result.sysparms.currentRound;
        $scope.month = result.sysparms.currentMonth;

    $http.get('http://localhost:3000/api/get_predictions/'+$scope.email+'/'+$scope.round)
      .success(function (result) {

          console.log(result);
          $scope.predictions = result;

      });

    $scope.submitForm = function(theForm)
    {
        console.log("and the form is ", theForm);
    }
    })
      .error(function (data, status) {

          console.log(data);

    });
}]);
