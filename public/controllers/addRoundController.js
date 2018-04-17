// CONTROLLERS

predictionApp.controller('addRoundController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

  console.log("In addRoundController");

  $scope.getFixtures = function ( start, end, cb) {

    /* startDate = {{ start | date : 'yyyy-MM-dd'}}
    endDate = {{ end | date : 'yyyy-MM-dd'}} */

    console.log(startDate, endDate);
    $http.get('http://localhost:3000/api/retrieve_fixtures/'+start+'/'+end)
      .success(function (result) {

        $scope.predictions = result;

      });

  };

  $http.get('http://localhost:3000/api/sysparms')
    .success(function (result) {

      $scope.email = result.email;
      $scope.round = result.currentRound;
      $scope.month = result.currentMonth;
      /* showFixtures = false; */
      $scope.predictions = [];
      $scope.startDate = new Date(Date.now());
      $scope.endDate = new Date;
      $scope.endDate.setDate($scope.startDate.getDate() + 7);
      });

}]);
