// CONTROLLERS

predictionApp.controller('fixtureController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    console.log("In fixtureController", $scope);

    $scope.submit = function() {

      // var data = {Round: $scope.round, fixture: $scope.fixture}
      console.log("In submit: ", $scope.fixture);
      $http.post('http://localhost:3000/api/put_fixtures/', $scope.fixture)
        .success(function (result) {
            console.log(result);
            $http.get('http://localhost:3000/api/get_fixtures/'+$scope.round)
              .success(function (result) {
                console.log("Recevied from get_fixtures: ", result);
                $scope.fixture = result;
              });
        })
        .error(function (data, status) {
            console.log(data);
      })
    };

    $scope.addMatch = function() {
      console.log("In addMatch", $scope.fixture);
      $scope.fixture.fixtures.push({"homeTeam" : "", "awayTeam" : ""})
    };

    $scope.populateFixtures = function(startDate, endDate) {
      data = {"startDate" : startDate, "endDate" : endDate};
      console.log("In populateFixtures; start ", startDate, "end ", endDate, "data ", data);
      $http.post('http://localhost:3000/api/populate_fixtures/', data)
        .success(function (result) {
          console.log("populateFixtures result: ", result);
        })
    };

    $scope.changeRound = function() {
      console.log("In changeRound", $scope.round);
      $http.get('http://localhost:3000/api/get_fixtures/'+$scope.round)
        .success(function (result) {
          if (!result) {
            console.log("Fixing null result");
            result = {Round : $scope.round, fixtures:[]}
          }
          console.log("Recevied from get_fixtures: ", result);
          $scope.fixture = result;
        });
    }

    $http.get('http://localhost:3000/api/sysparms')
      .success(function (result) {
        $scope.email = result.email;
        $scope.round = result.sysparms.currentRound;
        $scope.month = result.sysparms.currentMonth;
        });

}]);
