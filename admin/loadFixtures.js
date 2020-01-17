var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    parseString = require('xml2js').parseString,
    request = require('request'),
    http = require('http'),
    post = require('http-post'),
    fixtureData = '';

    payload = {
      'ApiKey':'QQQMPBBYBPJYCVJCBHFRQMFVOCOSLBPPCXVGWLRKRRKAEACUXC',
      'seasonDateString':'1819',
      'league':'Scottish Premier League',
      'startDateString': '2020-01-01',
      'endDateString' : '2020-01-31'
    };

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
client.connect(err => {
// MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (process.argv[2] == null || process.argv[3] == null ) {
    console.log("Usage: loadFixtures.js <start date> <end date> in YYYY-MM-DD format");
    process.exit(1)
  } else {
    startDateString = process.argv[2];
    endDateString = process.argv[3];
    console.log(`Using startDateString of ${startDateString} and endDateString of ${endDateString}`);
  };

  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db("prediction-league");

  post('http://www.xmlsoccer.com/FootballDataDemo.asmx/GetFixturesByDateIntervalAndLeague',
  payload, function(res){

      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

      res.on('data', function(chunk) {

        console.log(`Adding a chunk... ${chunk}`);
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

            console.log(`inputmatches length is ${inputmatches.length}`);

             for (var i = 0, len = inputmatches.length; i < len; i++) {
              /* console.log("Mapping match ID ", inputmatches[i].Id[0]); */
              console.log(`inputmatch is ${JSON.stringify(inputmatches[i])})`);
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
                _id : inputmatches[i].Id[0],
                round : parseInt(inputmatches[i].Round[0]),
                date : inputmatches[i].Date[0],
                homeTeam : inputmatches[i].HomeTeam[0],
                homeGoals : homegoals,
                awayTeam : inputmatches[i].AwayTeam[0],
                awayGoals : awaygoals,
                location : inputmatches[i].Location[0]
              }
              db.collection('fixtures').replaceOne({_id : match._id}, match, {upsert: true}, function(err, r) {

                assert.equal(null, err);
                console.log(`Fixture inserted with result ${r}`);
                client.close()
              // outputmatches.push(match);
              });

            /* console.log(outputmatches); */

            // db.collection('fixtures').updateMany({}, outputmatches, {upsert: true} function(err, r) {
            //
            //   assert.equal(null, err);
            //   console.log(`Fixtures inserted with result ${r}`);
            //
            // });


          };


      });

    });

  });
});
