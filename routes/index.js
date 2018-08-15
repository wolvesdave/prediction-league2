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
    Account.register(new Account({ username : req.body.username, email : req.body.email, fullname: req.body.fullname }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
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
    res.redirect('/predictions');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/predictions', function(req, res) {
    res.render('predictions', { user : req.user});
});

router.get('/fixtures', function(req, res) {
    res.render('fixtures', { user : req.user});
});

router.get('/api/get_predictions/:round', function(req, res, next) {
  console.log("GET get_predictions input: ", req.user.email, " ", req.params.round);
  var email = req.user.email;
  var round = req.params.round;
  Prediction.findOne({email : email, Round: round}).exec(function (err, result) {
    if (err) return console.error(err);
    console.log("GET get_predictions result:", result);
    res.send(result);
  });

});

router.post('/api/put_predictions', function(req, res) {
    var query = {"email" : req.user.email, "Round": parseInt(req.body.Round)};
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
  Fixture.find({"Round": round}).lean().exec(function (err, result) {
    if (err) return console.error(err);
    console.log("GET get_fixtures result:", result);
    res.send(result);
  });
});

router.post('/api/put_fixtures', function(req, res) {
    var query = {"Round": parseInt(req.body.Round)};
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

              console.log("outputmatches: ", outputmatches);

              for (var i = 0, len = outputmatches.length; i < len; i++) {
                Fixture.update(
                  {_id : outputmatches[i]._id},
                  outputmatches[i],
                  {upsert:true},
                  function(error, raw) {
                    if (err) return console.error(error);
                  });
              };
              res.send(outputmatches);

              // Fixture.insertMany(outputmatches, function(error, docs) {
              //     if (err) return console.error(error);
              //     console.log("docs: ", docs);
              //     res.send(docs);
              //   });
            });
        });
    });
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

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
