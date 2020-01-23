
  function calculateRound(currentRound, currentMonth, fixtureList, userList, callback) {
    console.log(`calculateRoundScore: Round ${currentRound} Month ${currentMonth} #Fixtures ${fixtureList.length} #Predictions ${predictionList.length}`);

// Iterate through list of Users, scoring their predictions for this round
  calculatedScoresList = userList.map(calcMatchScore);
// Updated predictions collection with scored Predictions

// Update Total, Weekly and Monthly scores and store in accounts collection


  function calcMatchScore (userItem, i, arr) {
    var newUserItem = userItem;
    var roundScore = 0;
    var jokersUsed = 0;
// Update each prediction with score
    userItem.predictions = userItem.predictions.map(calcPrediction);
// return the updated user item which now includes scored predictions
    return newUserItem
  }

  function calcPrediction (predictionItem, j, arr) {
    console.log(`calcPrediction: processing index ${j} prediction ${predictionItem[j]._id} : ${predictionItem.homeTeam} vs ${predictionItem.awayTeam}`);
    var fixtureLookup = fixtureList.filter(x=> x._id === predictionItem._id);
    console.log(`calcPrediction: Fixture: ${fixtureLookup[0]._id} homeGoals: ${fixtureLookup[0].homeGoals} awayGoals: ${fixtureLookup[0].awayGoals}`);
    var newPredictionItem = predictionItem;
    newPredictionItem.points = calcMatchScore(newPredictionItem);
    roundScore += newPredictionItem.points;
    if (newPredictionItem.joker) {
      jokersUsed++
    }
    console.log(`calculateRoundScore: newPredictionItem: ${newPredictionItem}`);
    newUserItem.predictions.push(newPredictionItem);
  }



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
