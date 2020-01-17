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
    sleep = require('sleep');
    findIndex = require('array.prototype.findindex');

    var db = mongoose.connect('mongodb://localhost/prediction-league', {
      useMongoClient: true,
      /* other options */
    });

  async.waterfall([
      getSysparms,
      getFixtures,
      getPredictions,
      calculateRoundScore,
      saveScores
  ], function(err, result) {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log(`Successful result ${result}`);
      mongoose.disconnect();
    }
  })

  function saveScores(currentRound, email, roundScore, callback) {
      console.log(`Updating user ${email} round ${currentRound} score by  ${roundScore}`);
      Account.findOne({email : email}, async function(err, doc) {
        if (err) {
          console.log(err);
          return err;
      } else {
        console.log(`Found this doc ${doc}`);
        doc.totalScore += roundScore;
        i = doc.weeklyScore.findIndex(i => i.round === currentRound);
        if (i < 0) {
          console.log(`Didnt find weekly score for round ${currentRound} - pushing it`);
          doc.weeklyScore.push({round : currentRound, score : roundScore})
        } else {
          console.log(`Found weekly score for round ${currentRound} - updating it`);
          doc.weeklyScore[i].score = roundScore;
        }
        await doc.save()
        console.log(`Successfully saved ${doc}`);
      }
      callback(null, 'successfully saved');
      });
    };

function calculateRoundScore(currentRound, fixtureList, predictionList, callback) {
  console.log("round ", currentRound, " Fixtures ", fixtureList, " Predictions ", predictionList);
  console.log("fixtureList Length is ", fixtureList.length);
  console.log("predictionList Length is ", predictionList.length);

  predictionList.forEach(function(userItem, i) {

    var newUserItem = {};
    var roundScore = 0;
    newUserItem._id = userItem._id;
    newUserItem.email = userItem.email;
    newUserItem.round = userItem.round;
    newUserItem.predictions = [];
    console.log("processing index ", i, " user", newUserItem);

    userItem.predictions.forEach(function(predictionItem, j) {
      console.log("processing index ", j, "prediction ", predictionItem, " ", userItem.predictions[j]._id);
      var fixtureLookup = fixtureList.filter(x=> x._id === predictionItem._id);
      console.log("Fixture ", fixtureLookup[0]._id, " homeGoals = ", fixtureLookup[0].homeGoals, "awayGoals = ", fixtureLookup[0].awayGoals);
      var newPredictionItem = {};
      newPredictionItem._id = predictionItem._id;
      newPredictionItem.homeTeam = predictionItem.homeTeam;
      newPredictionItem.awayTeam = predictionItem.awayTeam;
      newPredictionItem.homePrediction = predictionItem.homePrediction;
      newPredictionItem.awayPrediction = predictionItem.awayPrediction;
      newPredictionItem.joker = predictionItem.joker;
      newPredictionItem.homeGoals = fixtureLookup[0].homeGoals;
      newPredictionItem.awayGoals = fixtureLookup[0].awayGoals;
      newPredictionItem.points = calcMatchScore(newPredictionItem);
      roundScore += newPredictionItem.points;
      console.log("newPredictionItem", newPredictionItem);
      newUserItem.predictions.push(newPredictionItem);
    })
    console.log("modified predictionItem is ", newUserItem);
    Prediction.findOneAndUpdate({_id : newUserItem._id},newUserItem, function (err, doc) {
      if (err) {
        console.log(err);
        return err;
    } else {
      console.log("successfully saved prediction", doc);
    }
    });
    callback(null, currentRound, userItem.email, roundScore);
  });
}

  function getSysparms(callback) {
    if (process.argv[2] == null) {
      console.log("Using currentRound from sysparms");
      Sysparms.findOne({}).lean().exec(function (err, sysparms) {
        console.log("In getSysparms callback");
        if (err) return console.error(err);
        console.log(sysparms);
        var round = sysparms.currentRound;
      });
    } else {
      console.log("Using currentRound from command line");
      var round = Number(process.argv[2]);
    }
    console.log(`round is ${round}`);
    callback(null, round);
  };

  function getFixtures(currentRound, callback) {
    Fixture.find({round : currentRound}, function(err,fixtureList) {
      console.log("In getFixtures callback");
      if (err) return console.error(err);
      console.log("I got this round ", currentRound);
      callback(null, currentRound, fixtureList);
    });
  };

  function getPredictions(currentRound, fixtureList, callback) {
    Prediction.find({round : currentRound}, function(err,predictionList) {
      console.log("In getPredictions callback");
      if (err) return console.error(err);
      console.log("round ", currentRound, " Fixtures: ", fixtureList);
      callback(null, currentRound, fixtureList, predictionList);
    });
  };

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
