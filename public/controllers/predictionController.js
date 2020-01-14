// CONTROLLERS

predictionApp.controller('predictionController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In predictionController", $scope);
    $scope.userMessage = "Welcome"

    $scope.submit = function() {
      console.log("In submit");
      data = {email: $scope.email, round: $scope.round, prediction: $scope.prediction}
      $http.post('http://localhost:3000/api/put_predictions/', data)
        .success(function (result) {
            console.log(result);
            $http.get('http://localhost:3000/api/get_predictions/'+$scope.round)
              .success(function (result) {
                console.log("Received from get_predictions: ", result);
                $scope.prediction = result;
                $scope.userMessage = "Changes saved successfully!"
              });
        })
        .error(function (data, status) {
            console.log(data);
      })
    };

    $scope.getPredictions = function() {
      console.log("In changeRound ", $scope.round);
      $http.get('http://localhost:3000/api/get_predictions/'+$scope.round)
        .success(function (result) {
          console.log("Received from get_predictions: ", result);
          $scope.prediction = result;
        })
        .error(function (data, status) {
            console.log(data);
        });
    };

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {
        $scope.email = result.email;
        $scope.sysparms = result.sysparms;
        $scope.round = result.sysparms.currentRound;
        $scope.month = result.sysparms.currentMonth;
        $scope.getPredictions();
    });
}]);
