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
