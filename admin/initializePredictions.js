var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Account = require('../models/account'),
    Sysparms = require('../models/sysparms'),
    Prediction = require('../models/prediction'),
    Fixture = require('../models/fixture'),
    http = require('http'),
    post = require('http-post'),
    async = require('async'),
    mongoose = require('mongoose');

    mongoose.connect('mongodb://localhost/prediction-league', {
      useMongoClient: true,
      /* other options */
    });

    if (process.argv[2] == null) {
      console.log("Usage: initializePredictions.js <round#>");
      process.exit(1)
    } else {
      currentRound = process.argv[2];
    };


  async.waterfall([
      getUsers,
      getFixtures,
  ], function (err, userList, fixtureList) {
      console.log("Got this round ", currentRound, " these users ", userList, " these fixtures ", fixtureList);
      console.log("userList Length is ", userList.length);
      console.log("fixtureList Length is ", fixtureList.length);

      userList.forEach(userItem => {
        console.log("processing user", userItem);
        var prediction = new Prediction();
        prediction._id = mongoose.Types.ObjectId();
        prediction.email = userItem.email;
        prediction.Round = currentRound;
        fixtureList.forEach(fixtureItem => {
          console.log("processing fixture", fixtureItem);
          prediction.predictions.push(fixtureItem)
        })
        console.log("new prediction is ", prediction);
        prediction.save(function(err) {
          if (err) {
            console.log("Error saving prediction  ", err);
          }
          console.log("Successfully inserted prediction")
        })
        })
      });

  function getUsers(callback) {
    Account.find({},{'_id' : false, 'email': true}, function(err,userList) {
      console.log("In getUsers callback");
      if (err) return console.error(err);
      console.log("round ", currentRound, " got these results: ", userList);
      callback(null, userList);
    });
  };

  function getFixtures(userList, callback) {
    Fixture.find({Round : currentRound}, function(err,fixtureList) {
      console.log("In getFixtures callback");
      if (err) return console.error(err);
      console.log("I got this round ", currentRound, " and these users: ", userList);
      callback(null, userList, fixtureList);
    });
  };
