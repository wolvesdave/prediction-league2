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
      calculateRound
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
      console.log(`getPredictions: round ${currentRound} Month ${currentMonth} #Fixtures: ${fixtureList.length}`);
      callback(null, currentRound, currentMonth, fixtureList, predictionList);
    });
  };

  function calculateRound(currentRound, currentMonth, fixtureList, predictionList, callback) {
    console.log(`calculateRoundScore: Round ${currentRound} Month ${currentMonth} #Fixtures ${fixtureList.length} #Predictions ${predictionList.length}`);
    // console.dir(fixtureList,{depth:2});
    console.dir(predictionList,{depth:6})
// Iterate through list of Users, scoring their predictions for this round
    scoredPredictionList = predictionList.map(calcMatchScore);
    console.dir(scoredPredictionList,{depth:6})
// Update predictions collection with scored Predictions

// Update Total, Weekly and Monthly scores and store in accounts collection
}

  function calcMatchScore (userItem, i, arr) {
    console.log(`calcMatchScore: index ${i} userItem ${userItem}`);
    console.dir(userItem.predictions,{depth:2})
    var fixtureList = this.fixtureList;
    var newUserItem = userItem;
    var roundScore = 0;
    var jokersUsed = 0;
// Update each prediction with score
    newUserItem.predictions = userItem.predictions.map(calcPrediction);
// return the updated user item which now includes scored predictions
    return newUserItem
  }

  function calcPrediction (predictionItem, j, arr) {
    console.log(`calcPrediction: processing index ${j} prediction ${predictionItem[j]._id} : ${predictionItem.homeTeam} vs ${predictionItem.awayTeam}`);
    var fixtureList = this.fixtureList;
    console.log(`fixtureList is ${fixtureList}`);
    var fixtureLookup = fixtureList.filter(x=> x._id === predictionItem._id);
    console.log(`calcPrediction: Fixture: ${fixtureLookup[0]._id} homeGoals: ${fixtureLookup[0].homeGoals} awayGoals: ${fixtureLookup[0].awayGoals}`);
    var newPredictionItem = predictionItem;
    newPredictionItem.points = calcMatchScore(newPredictionItem);
    roundScore += newPredictionItem.points;
    if (newPredictionItem.joker) {
      jokersUsed++
    }
    console.log(`calculateRoundScore: newPredictionItem: ${newPredictionItem}`);
    return newPredictionItem;
  }

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

  // Saved original code
  //
  //       console.log(`calculateRoundScore: modified predictionItem is ${newUserItem}`);
  //       Prediction.findOneAndUpdate({_id : newUserItem._id},newUserItem, async function (err, doc) {
  //         if (err) {
  //           console.log(err);
  //           return err;
  //       } else {
  //         console.log(`calculateRoundScore: successfully saved prediction ${doc.email} round ${doc.round}`);
  //         await saveScores(currentRound, newUserItem.email, roundScore, jokersUsed)
  //       }
  //     });
  //
  // function saveScores(currentRound, email, roundScore, jokersUsed, callback) {
  //     console.log(`saveScores: Updating user ${email} round ${currentRound} score by  ${roundScore}`);
  //     Account.findOne({email : email}, function(err, doc) {
  //       if (err) {
  //         console.log(err);
  //         return err;
  //     } else {
  //       console.log(`saveScores: Found this doc ${doc.email}`);
  //       doc.totalScore += roundScore;
  //       if (jokersUsed) {
  //         doc.jokers = doc.jokers-jokersUsed
  //       }
  //       i = doc.weeklyScore.findIndex(i => i.round === currentRound);
  //       if (i < 0) {
  //         console.log(`saveScores: Didnt find weekly score for round ${currentRound} - pushing it`);
  //         doc.weeklyScore.push({round : currentRound, score : roundScore})
  //       } else {
  //         console.log(`saveScores: Found weekly score for round ${currentRound} - updating it`);
  //         doc.weeklyScore[i].score = roundScore;
  //       }
  //       doc.save()
  //       console.log(`saveScores: Successfully saved ${doc.email}`);
  //     }
  //     });
  //   };
  //
  //
