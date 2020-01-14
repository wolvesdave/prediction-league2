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

    Prediction.find({}, function(err, docs) {
      docs.forEach(function(user){
        user.predictions.forEach(function(pred){
          points = calcMatchScore(pred);
          console.log("Prediction: ", pred, " Points: ", points);
        })
      })
    })

function calcMatchScore(prediction) {
  var score = 0;
  var pointsDeduction = 0;
  if (prediction.homeGoals > prediction.awayGoals) {
      result = "Home Win";
  } else
  if (prediction.homeGoals == prediction.awayGoals) {
      result = "Draw";
  } else
  if (prediction.homeGoals < prediction.awayGoals) {
      result = "Away Win";
  };
  if (prediction.homePrediction > prediction.awayPrediction) {
      predictedResult = "Home Win";
  } else
  if (prediction.homePrediction == prediction.awayPrediction) {
      predictedResult = "Draw";
  } else
  if (prediction.homePrediction < prediction.awayPrediction) {
      predictedResult = "Away Win";
  };
  console.log("Result was ", result, " Prediction was ", predictedResult);
  if (result == predictedResult) {
    if (result == "Home Win") {
      score = 10
    } else {
      score = 15
    }
    if (prediction.homeGoals == prediction.homePrediction) {
      score = score * 3
    } else {
      pointsDeduction = Math.abs(prediction.homeGoals - prediction.homePrediction) + Math.abs(prediction.awayGoals - prediction.awayPrediction)
      score = score - pointsDeduction;
    }
  } else score = -5;
  if (prediction.joker) {score = score * 3};
  console.log("Score: ", score, " Deduction: ", pointsDeduction, " Joker: ", prediction.joker);
  return score
};
