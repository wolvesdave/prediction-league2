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

  async.waterfall([
      getSysparms,
      getFixtures,
      getPredictions,
  ], function (err, currentRound, fixtureList, predictionList) {
      console.log("Round ", currentRound, " Fixtures ", fixtureList, " Predictions ", predictionList);
      console.log("fixtureList Length is ", fixtureList.length);
      console.log("predictionList Length is ", predictionList.length);

      predictionList.forEach(function(userItem, i) {

        var newUserItem = {};
        newUserItem._id = userItem._id;
        newUserItem.email = userItem.email;
        newUserItem.Round = userItem.Round;
        newUserItem.predictions = [];
        console.log("processing index ", i, " user", newUserItem);

        userItem.predictions.forEach(function(predictionItem, j) {
          console.log("processing index ", j, "prediction ", predictionItem, " ", userItem.predictions[j]._id);
          var fixtureLookup = fixtureList.filter(x=> x._id === predictionItem._id);
          console.log("Fixture ", fixtureLookup[0]._id, " HomeGoals = ", fixtureLookup[0].HomeGoals, "AwayGoals = ", fixtureLookup[0].AwayGoals);
          var newPredictionItem = {};
          newPredictionItem._id = predictionItem._id;
          newPredictionItem.HomeTeam = predictionItem.HomeTeam;
          newPredictionItem.AwayTeam = predictionItem.AwayTeam;
          newPredictionItem.HomePrediction = predictionItem.HomePrediction;
          newPredictionItem.AwayPrediction = predictionItem.AwayPrediction;
          newPredictionItem.joker = predictionItem.joker;
          newPredictionItem.HomeGoals = fixtureLookup[0].HomeGoals;
          newPredictionItem.AwayGoals = fixtureLookup[0].AwayGoals;
          newPredictionItem.points = calcMatchScore(newPredictionItem);
          console.log("newPredictionItem", newPredictionItem);
          newUserItem.predictions.push(newPredictionItem);
        })
        console.log("modified predictionItem is ", newUserItem);
        Prediction.findOneAndUpdate({_id : newUserItem._id},newUserItem, function (err, doc) {
          if (err) {
            console.log(err);
            return err;
        } else {
          console.log("successfully saved ", doc);
        }
        });
        })
      });

  function getSysparms(callback) {
    Sysparms.findOne({}).lean().exec(function (err, sysparms) {
      console.log("In getSysparms callback");
      if (err) return console.error(err);
      console.log(sysparms);
      var round = sysparms.currentRound;
      console.log("Round is ", round);
      callback(null, round);
    });
  };

  function getFixtures(currentRound, callback) {
    Fixture.find({Round : currentRound}, function(err,fixtureList) {
      console.log("In getFixtures callback");
      if (err) return console.error(err);
      console.log("I got this round ", currentRound);
      callback(null, currentRound, fixtureList);
    });
  };

  function getPredictions(currentRound, fixtureList, callback) {
    Prediction.find({Round : currentRound}, function(err,predictionList) {
      console.log("In getPredictions callback");
      if (err) return console.error(err);
      console.log("Round ", currentRound, " Fixtures: ", fixtureList);
      callback(null, currentRound, fixtureList, predictionList);
    });
  };

  function calcMatchScore(prediction) {
    var score = 0;
    var pointsDeduction = 0;
    if (prediction.HomeGoals > prediction.AwayGoals) {
        result = "Home Win";
    } else
    if (prediction.HomeGoals == prediction.AwayGoals) {
        result = "Draw";
    } else
    if (prediction.HomeGoals < prediction.AwayGoals) {
        result = "Away Win";
    };
    if (prediction.HomePrediction > prediction.AwayPrediction) {
        predictedResult = "Home Win";
    } else
    if (prediction.HomePrediction == prediction.AwayPrediction) {
        predictedResult = "Draw";
    } else
    if (prediction.HomePrediction < prediction.AwayPrediction) {
        predictedResult = "Away Win";
    };
    console.log("Result was ", result, " Prediction was ", predictedResult);
    if (result == predictedResult) {
      if (result == "Home Win") {
        score = 10
      } else {
        score = 15
      }
      if (prediction.HomeGoals == prediction.HomePrediction) {
        score = score * 3
      } else {
        pointsDeduction = Math.abs(prediction.HomeGoals - prediction.HomePrediction) + Math.abs(prediction.AwayGoals - prediction.AwayPrediction)
        score = score - pointsDeduction;
      }
    } else score = -5;
    if (prediction.joker) {score = score * 3};
    console.log("Score: ", score, " Deduction: ", pointsDeduction, " Joker: ", prediction.joker);
    return score
  };
