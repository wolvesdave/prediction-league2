var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Sysparms = require('../models/sysparms');
var Prediction = require('../models/prediction');
var Fixture = require('../models/fixture');
var router = express.Router();

router.get('/', function (req, res) {
  // Sysparms.findOne({}).lean().exec(function (err, sysparms) {
  //   if (err) return console.error(err);
    res.render('index', {user : req.user});
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
  Prediction.findOne({"email" : email, "Round": round}).lean().exec(function (err, result) {
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
  Fixture.findOne({"Round": round}).lean().exec(function (err, result) {
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
