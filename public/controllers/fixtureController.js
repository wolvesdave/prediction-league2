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
      console.log("In populateFixtures", $scope.fixture, “start “, startDate, “end “, endDate);
      http.post = require('http-post');

      payload = {
        'ApiKey':'QQQMPBBYBPJYCVJCBHFRQMFVOCOSLBPPCXVGWLRKRRKAEACUXC',
        'seasonDateString':'1718',
        'league':'Scottish Premier League',
  		'startDateString' : startDate,
  		'endDateString' : endDate
      };

MongoClient.connect('mongodb://localhost:27017', function(err, client) {

  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db("prediction-league");

  post('http://www.xmlsoccer.com/FootballDataDemo.asmx/GetFixturesByDateIntervalAndLeague',
  payload, function(res){

      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      res.on('data', function(chunk) {

        console.log("Adding a chunk... ");
        fixtureData+= chunk;

      });

      res.on('end',function() {

        parseString(fixtureData, function (err, result) {

          if(err) {
              console.log('Unknown Error');
              return;
            }

            var inputmatches = result["XMLSOCCER.COM"].Match,
                outputmatches = [];

            console.log(inputmatches.length);

             for (var i = 0, len = inputmatches.length; i < len; i++) {
              /* console.log("Mapping match ID ", inputmatches[i].Id[0]); */
              if (inputmatches[i].HomeGoals !== undefined) {
                homegoals = parseInt(inputmatches[i].HomeGoals[0])
              } else {
                homegoals = ""
              }
              if (inputmatches[i].AwayGoals !== undefined) {
                awaygoals = parseInt(inputmatches[i].AwayGoals[0])
              } else {
                awaygoals = ""
              }
              match = {
                "_id" : inputmatches[i].Id[0],
                "Round" : parseInt(inputmatches[i].Round[0]),
                "Date" : inputmatches[i].Date[0],
                "HomeTeam" : inputmatches[i].HomeTeam[0],
                "HomeGoals" : homegoals,
                "AwayTeam" : inputmatches[i].AwayTeam[0],
                "AwayGoals" : awaygoals,
                "Location" : inputmatches[i].Location[0]
              }
              outputmatches.push(match);
            };

            /* console.log(outputmatches); */

            db.collection('fixtures').insertMany(outputmatches, function(err, r) {

              assert.equal(null, err);
              console.log('Fixtures inserted with result ', r);

            });


        });

      });

  });

});

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

        $http.get('http://localhost:3000/api/get_fixtures/'+$scope.round)
          .success(function (result) {
            if (!result) {
              console.log("Fixing null result");
              result = {Round : $scope.round, fixtures:[]}
            }
            console.log("Recevied from get_fixtures: ", result);
            $scope.fixture = result;
          });
      })
      .error(function (data, status) {
          console.log(data);
    });
}]);
