var express = require('express'),
    passport = require('passport'),
    Account = require('../models/account'),
    Sysparms = require('../models/sysparms'),
    Prediction = require('../models/prediction'),
    Fixture = require('../models/fixture'),
    assert = require('assert'),
    parseString = require('xml2js').parseString,
    request = require('request'),
    http = require('http'),
    post = require('http-post'),
    router = express.Router()

router.get('/', function (req, res) {
  // Sysparms.findOne({}).lean().exec(function (err, sysparms) {
  //   if (err) return console.error(err);
    res.render('index', {user : req.user});
  // });
});

router.get('/admin', function (req, res) {
    res.render('admin', {user : req.user});
  // });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username, email : req.body.email, fullname: req.body.fullname, jokers : 38}), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        } else {
          for (var i = 1; i <= 12; i++) {
          account.monthlyScore.push({month:i, score:0})
          }
          for (var i = 0; i <= 37; i++) {
          account.weeklyScore.push({round : i, score : 0})
          }
          account.save()
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    Sysparms.findOne({}).lean().exec(function (err, sysparms) {
      if (err) return console.error(err);
      res.sysparms = sysparms;
      console.log("Login sysparms result: ", sysparms);
    });
    res.render('index', { user : req.user });
    // res.redirect('/predictions');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/predictions', function(req, res) {
    res.render('predictions', { user : req.user});
});

router.get('/predictions-admin', function(req, res) {
    res.render('predictions-admin', { user : req.user});
});

router.get('/table', function(req, res) {
    res.render('table', { user : req.user});
});

router.get('/fixtures', function(req, res) {
    res.render('fixtures', {moment:require('moment'), user : req.user});
});


router.get('/fixtures-admin', function(req, res) {
    res.render('fixtures-admin', {moment:require('moment'), user : req.user});
});

router.get('/api/get_predictions/:round', function(req, res, next) {
  console.log("GET get_predictions input: ", req.user.email, " ", req.params.round);
  var email = req.user.email;
  var round = req.params.round;
  Prediction.findOne({email : email, round: round}).exec(function (err, result) {
    if (err) return console.error(err);
    console.log("GET get_predictions result:", result);
    res.send(result);
  });

});

router.post('/api/put_predictions', function(req, res) {
    var query = {"email" : req.user.email, "round": parseInt(req.body.round)};
    var newPrediction = req.body.prediction;

    console.log("POST predictions input: newPrediction ", req.body.newPrediction, "user ", req.user, "query: ", query);

    Prediction.update(query, newPrediction,
      {overwrite: true},
      function(err, result) {
        if (err) return console.error(err);
        console.log("Modified prediction: ", result);
        res.send(result);
    });
});

router.get('/api/get_fixtures/:round', function(req, res, next) {
  console.log("GET get_fixtures input: ", req.params.round);
  var round = req.params.round;
  Fixture.find({"round": round}).lean().exec(function (err, result) {
    if (err) return console.error(err);
    console.log("GET get_fixtures result:", result);
    res.send(result);
  });
});

router.post('/api/put_fixtures', function(req, res) {
    var query = {"round": parseInt(req.body.round)};
    var newFixture = req.body;

    console.log("POST fixtures input: newFixture ", newFixture, "query: ", query);

    Fixture.update(query, newFixture,
      {overwrite: true, upsert : true},
      function(err, result) {
        if (err) return console.error(err);
        console.log("Modified fixture: ", result);
        res.send(result);
    });

});

router.post('/api/populate_fixtures', function(req,res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var fixtureData = '';
    var payload = {
      "ApiKey":"QQQMPBBYBPJYCVJCBHFRQMFVOCOSLBPPCXVGWLRKRRKAEACUXC",
      "seasonDateString":"1819",
      "league":"Scottish Premier League",
      "startDateString": startDate,
      "endDateString" : endDate
    };

    console.log("here we go with payload ", payload);

    post('http://www.xmlsoccer.com/FootballDataDemo.asmx/GetFixturesByDateIntervalAndLeague',
    payload, function(xmlres){

        console.log(`STATUS: ${xmlres.statusCode}`);
        xmlres.setEncoding('utf8');
        console.log(`HEADERS: ${JSON.stringify(xmlres.headers)}`);

        xmlres.on('data', function(chunk) {

          console.log("Adding a chunk... ", chunk);
          fixtureData+= chunk;

        });

        xmlres.on('end',function(response) {

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
                if (inputmatches[i].homeGoals !== undefined) {
                  homegoals = parseInt(inputmatches[i].homeGoals[0])
                } else {
                  homegoals = ""
                }
                if (inputmatches[i].awayGoals !== undefined) {
                  awaygoals = parseInt(inputmatches[i].awayGoals[0])
                } else {
                  awaygoals = ""
                }
                match = {
                  "_id" : inputmatches[i].Id[0],
                  "round" : parseInt(inputmatches[i].round[0]),
                  "Date" : inputmatches[i].Date[0],
                  "homeTeam" : inputmatches[i].homeTeam[0],
                  "homeGoals" : homegoals,
                  "awayTeam" : inputmatches[i].awayTeam[0],
                  "awayGoals" : awaygoals,
                  "Location" : inputmatches[i].Location[0]
                }
                outputmatches.push(match);
              };
              console.log("outputmatches: ", outputmatches);
              res.send(outputmatches);

            });
        });
    });
  });

router.post('/api/save_fixtures', function(req,res) {
      var fixtures = req.body.fixtures;
      console.log("Saving fixtures ", fixtures, " length ", fixtures.length);
      for (var i = 0, len = fixtures.length; i < len; i++) {
      Fixture.update(
        {_id : fixtures[i]._id},
        fixtures[i],
        {upsert:true},
        function(err, raw) {
          if (err) return console.error(err);
        });
    };
});

router.get('/api/sysparms', function(req, res) {
    /* Get System parameters */
  console.log("GET sysparms input: ", req.user);
  Sysparms.findOne({}).lean().exec(function (err, sysparms) {
    if (err) return console.error(err);
    var result = {'email': req.user.email, 'sysparms': sysparms};
    console.log("GET sysparms result: ", result);
    res.send(result);
  });
});

router.get('/api/get_scores', function(req, res) {
  console.log("In get_scores");
  Account.find({},{_id: 0, username: 1, fullname: 1, totalScore : 1, weeklyScore : 1, monthlyScore : 1, jokers : 1}).exec(function (err, results) {
    if (err) return console.error(err);
    console.log("GET scores result: ", results);
    res.send(results);
  });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
