var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Sysparms = require('../models/sysparms');
var Predictions = require('../models/predictions');
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
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/predictions', function(req, res) {
    res.render('predictions', { user : req.user });
});

router.post('/predictions', function(req, res) {
    console.log("req: ", req.body);
//    res.render('predictions', { user : req.user });
});

router.get('/api/sysparms', function(req, res) {
    /* Get System parameters */
  Sysparms.findOne({}).lean().exec(function (err, sysparms) {
    if (err) return console.error(err);
    var result = {'user': req.user.email, 'sysparms': sysparms};
    res.send(result);
  });
});

router.get('/api/get_predictions/:email/:round', function(req, res, next) {
  console.log("This is the parms: ", req.params.email, " ", req.params.round);
  /* var user = req.body.user; */
  var email = req.params.email;
  var round = req.params.Round;
  Predictions.find({"email" : email, "Round": round}).lean().exec(function (err, result) {
    if (err) return console.error(err);
    console.log("This is the result:", result);
    res.send(result);
  });

/*  db.collection('predictions').find({"email" : email, "Round": round}).toArray(function (err, docs) {
        assert.equal(null, err);
        console.log("Called get_predictions API");
        console.log(docs);
        res.send(docs)
    }); */
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
