// CONTROLLERS

predictionApp.controller('predictionController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In predictionController", $scope);

    $scope.submit = function() {
      console.log("In submit");
      // $http.post('http://localhost:3000/api/put_predictions/'+$scope.email+'/'+$scope.round)
      data = {email: $scope.email, Round: $scope.round, prediction: $scope.prediction}
      $http.post('http://localhost:3000/api/put_predictions/', data)
        .success(function (result) {
            console.log(result);
            $http.get('http://localhost:3000/api/get_predictions/'+$scope.round)
              .success(function (result) {
                console.log("Recevied from get_predictions: ", result);
                $scope.prediction = result;
              });
        })
        .error(function (data, status) {
            console.log(data);
      })
    };

    $scope.changeMonth = function() {
      console.log("In changeMonth", $scope.month);
    };

    $scope.changeRound = function() {
      console.log("In changeRound ", $scope.round);
    };

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {
        $scope.email = result.email;
        $scope.round = result.sysparms.currentRound;
        $scope.month = result.sysparms.currentMonth;

        $http.get('http://localhost:3000/api/get_predictions/'+$scope.round)
          .success(function (result) {
            console.log("Recevied from get_predictions: ", result);
            $scope.prediction = result;
          });
    })
      .error(function (data, status) {
          console.log(data);
    });
}]);
