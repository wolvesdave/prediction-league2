var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Sysparms = require('../models/sysparms');
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

router.get('/api/sysparms', function(req, res) {
    /* Get System parameters */
  Sysparms.findOne({}).lean().exec(function (err, sysparms) {
    if (err) return console.error(err);
    console.log("here ", req.session.passport.user, sysparms, " ", sysparms);
    res.render('sysparms', {user : req.user, month: sysparms.currentMonth, round: sysparms.currentRound});
  });

/*    db.collection('admin').findOne({"_id":"admin"},{},function (err, doc) {
        assert.equal(null, err);
        var currentRound = doc.currentRound;
        var currentMonth = doc.currentMonth;
        console.log("Retrieved defaults - ", doc);
        res.send(doc)
    }); */
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
