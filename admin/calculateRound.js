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

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    client.connect(err => {

  async.waterfall([
      getSysparms,
      getFixtures,
      getPredictions,
      calculateRoundScore
  ], function(err, result) {
    if (err) {
      console.log(`Failure ${err}`);
      client.close()
    } else {
      console.log(`Successful result ${result}`);
    }
    console.log("about to close client");
    client.close()
  })

  function getSysparms(callback) {
    console.log("Using currentRound from sysparms");
    Sysparms.findOne({}).lean().exec(function (err, sysparms) {
      if (err) return console.error(err);
      var round = sysparms.currentRound;
      var month = sysparms.currentMonth;
      console.log(`Sysparms: round is ${round}, month is ${month}`);
      callback(null, round, month);
    });
  };

  function getFixtures(currentRound, currentMonth, callback) {
    Fixture.find({round : currentRound}, function(err, fixtureList) {
      if (err) return console.error(err);
      console.log(`getFixtures: I got this round ${currentRound} and this month ${currentMonth}`);
      callback(null, currentRound, currentMonth, fixtureList);
    });
  };

  function getPredictions(currentRound, currentMonth, fixtureList, callback) {
    Prediction.find({round : currentRound}, function(err,predictionList) {
      if (err) return console.error(err);
      console.log(`getPredctions: round ${currentRound} Month ${currentMonth} #Fixtures: ${fixtureList.length}`);
      callback(null, currentRound, currentMonth, fixtureList, predictionList);
    });
  };

  function calculateRoundScore(currentRound, currentMonth, fixtureList, predictionList, callback) {
    console.log(`calculateRoundScore: Round ${currentRound} Month ${currentMonth} #Fixtures ${fixtureList.length} #Predictions ${predictionList.length}`);
    //
    // var bar = new Promise((resolve, reject) => {
    //     foo.forEach((value, index, array) => {
    //         console.log(value);
    //         if (index === array.length -1) resolve();
    //     });
    // });
    //
    // bar.then(() => {
    //     console.log('All done!');
    // });

    var predictionLoop = new Promise((resolve, reject) => {

      predictionList.forEach(function(userItem, i, array) {
        var newUserItem = {};
        var roundScore = 0;
        var jokersUsed = 0;
        newUserItem._id = userItem._id;
        newUserItem.email = userItem.email;
        newUserItem.round = userItem.round;
        newUserItem.predictions = [];

        userItem.predictions.forEach(function(predictionItem, j) {
          console.log(`calculateRoundScore: processing ${newUserItem.email} index ${j} prediction ${userItem.predictions[j]._id} : ${predictionItem.homeTeam} vs ${predictionItem.awayTeam}`);
          var fixtureLookup = fixtureList.filter(x=> x._id === predictionItem._id);
          console.log(`calculateRoundScore: Fixture: ${fixtureLookup[0]._id} homeGoals: ${fixtureLookup[0].homeGoals} awayGoals: ${fixtureLookup[0].awayGoals}`);
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
          if (newPredictionItem.joker) {
            jokersUsed++
          }
          console.log(`calculateRoundScore: newPredictionItem: ${newPredictionItem}`);
          newUserItem.predictions.push(newPredictionItem);
        })
        console.log(`calculateRoundScore: modified predictionItem is ${newUserItem}`);
        Prediction.findOneAndUpdate({_id : newUserItem._id},newUserItem, async function (err, doc) {
          if (err) {
            console.log(err);
            return err;
        } else {
          console.log(`calculateRoundScore: successfully saved prediction ${doc.email} round ${doc.round}`);
          await saveScores(currentRound, newUserItem.email, roundScore, jokersUsed)
        }
      });
      if (i === array.length -1) {
        console.log("Resolving Promise");
        resolve();
      }
      });
    })

    predictionLoop.then(() => {
      console.log("Calling back in calculateRoundScore");
      callback(null, "Yay!");
    });
  }

  function saveScores(currentRound, email, roundScore, jokersUsed, callback) {
      console.log(`saveScores: Updating user ${email} round ${currentRound} score by  ${roundScore}`);
      Account.findOne({email : email}, function(err, doc) {
        if (err) {
          console.log(err);
          return err;
      } else {
        console.log(`saveScores: Found this doc ${doc.email}`);
        doc.totalScore += roundScore;
        if (jokersUsed) {
          doc.jokers = doc.jokers-jokersUsed
        }
        i = doc.weeklyScore.findIndex(i => i.round === currentRound);
        if (i < 0) {
          console.log(`saveScores: Didnt find weekly score for round ${currentRound} - pushing it`);
          doc.weeklyScore.push({round : currentRound, score : roundScore})
        } else {
          console.log(`saveScores: Found weekly score for round ${currentRound} - updating it`);
          doc.weeklyScore[i].score = roundScore;
        }
        doc.save()
        console.log(`saveScores: Successfully saved ${doc.email}`);
      }
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
    console.log(`calcMatchScore: Result was ${result} ${prediction.homeGoals} - ${prediction.awayGoals}`);
    console.log(`calcMatchScore: Prediction was ${predictedResult} ${prediction.homePrediction} - ${prediction.awayPrediction}`);
    console.log(`calcMatchScore: Calculated points: ${score} Deduction: ${pointsDeduction} Joker: ${prediction.joker}`);
    return score
  };

})
