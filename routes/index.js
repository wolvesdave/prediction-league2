var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Sysparms = require('../models/sysparms');
var Prediction = require('../models/prediction');
var router = express.Router();

router.get('/', function (req, res) {
  Sysparms.findOne({}).lean().exec(function (err, sysparms) {
    if (err) return console.error(err);
    res.render('index', {user : req.user});
  });
//    res.render('index', { user : req.user , username : "wiggy", round : 1});
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
    res.redirect('/predictions');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/predictions', function(req, res) {
    res.render('predictions', { user : req.user });
});

router.post('/predictions', function(req, res) {
    var query = {"email" : req.user.email, "Round": parseInt(req.body.round)};

    console.log("POST predictions input: body ", req.body, "user ", req.user, "query: ", query);

    pred = [];

    for (i = 0; i < req.body.homeTeam.length; i++) {

      var joker = new Boolean(req.body.joker[i] == '1');

      console.log("Adding this prediction: ",
      "homeTeam", req.body.homeTeam[i],
      "homePrediction", req.body.homePrediction[i],
      "awayTeam", req.body.awayTeam[i],
      "awayPrediction", req.body.awayPrediction[i],
      "joker", joker
    );

      n = pred.push(
        {"homeTeam" : req.body.homeTeam[i],
        "homePrediction" : req.body.homePrediction[i],
        "awayTeam" : req.body.awayTeam[i],
        "awayPrediction" : req.body.awayPrediction[i],
        "joker" : joker}
      );
      console.log("predictions now ", n, " long", pred);
    };

    console.log("Attempting to modify prediction: ", pred, "using query ", query);

    Prediction.update(query, {
      $set: {predictions: pred}
      },
      {overwrite: true},
      function(err, result) {
        if (err) return console.error(err);
        console.log("Modified prediction: ", result);
    });

    res.redirect('/predictions');

    });
    //       "$set": {"predictions": pred},
    //   Prediction.findOne(query, function (err, result) {
    //   if (err) return console.error(err);
    //   console.log("POST predictions findOne result: ", result);
    //
    //   result.predictions = [];
    //
    //   console.log("predictions is now: ", result.predictions, " ", result);
    //
    //   for (i = 0; i < req.body.homeTeam.length; i++) {
    //
    //     console.log("Adding this prediction: ",
    //     "homeTeam", req.body.homeTeam[i],
    //     "homePrediction", req.body.homePrediction[i],
    //     "awayTeam", req.body.awayTeam[i],
    //     "awayPrediction", req.body.awayPrediction[i],
    //     "joker", req.body.joker[i]
    //   );
    //
    //     n = result.predictions.push(
    //       {"homeTeam" : req.body.homeTeam[i],
    //       "homePrediction" : req.body.homePrediction[i],
    //       "awayTeam" : req.body.awayTeam[i],
    //       "awayPrediction" : req.body.awayPrediction[i],
    //       "joker" : req.body.joker[i],}
    //     );
    //     console.log("predictions now ", n, " long", result.predictions);
    //   };
    //
    //   console.log("Attempting to modify prediction: ", result.predictions);
    //
    //   result.save(function(err, result) {
    //     if (err) return console.error(err);
    //     console.log("Modified prediction: ", result);
    //   });
    //
    //
    //   // Prediction.findOneAndUpdate(query, { predictions : predictions }, {upsert:true, overwrite:true}, function(err, doc){
    //   //     if (err) return console.error("Save Failed: ", err);
    //   //     console.log("Save worked!", doc);
    //
    //   res.redirect('/predictions')
    //
    // });

    // var pred = new Prediction( {email : req.user.email, name : req.user.username, Round : req.body.round});
    // pred.save(function (err, pred, numAffected) {
    //   if (err) {
    //     console.log("Shit");
    //   }
    //   console.log("Saved ", numAffected, " : ", pred);
    //   res.redirect('/predictions');
    // })

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

router.get('/api/get_predictions/:email/:round', function(req, res, next) {
  console.log("GET get_predictions input: ", req.params.email, " ", req.params.round);
  // var user = req.body.user;
  var email = req.params.email;
  var round = req.params.round;
  Prediction.findOne({"email" : email, "Round": round},{_id : 0, predictions : 1}).lean().exec(function (err, result) {
    if (err) return console.error(err);
    console.log("GET get_predictions result:", result.predictions);
    res.send(result.predictions);
  });

});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
