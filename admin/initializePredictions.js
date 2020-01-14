var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    http = require('http'),
    post = require('http-post'),
    async = require('async')
    // Account = require('../models/account'),
    // Sysparms = require('../models/sysparms'),
    // Prediction = require('../models/prediction'),
    // Fixture = require('../models/fixture'),    // mongoose = require('mongoose');

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    client.connect(err => {

    if (process.argv[2] == null) {
      console.log("Usage: initializePredictions.js <round#>");
      process.exit(1)
    } else {
      currentRound = Number(process.argv[2]);
    };
    const db = client.db("prediction-league");

  async.waterfall([
      getUsers,
      getFixtures,
  ], function (err, userList, fixtureList) {
      console.log(`Got this round ${currentRound} these users ${userList} these fixtures ${fixtureList}`);
      console.log(`userList is ${userList}`);
      console.log(`fixtureList is ${fixtureList}`);

      userList.forEach(userItem => {
        console.log(`processing user ${userItem}`);
        // var prediction = new Prediction();
        var prediction = new Object();
        // prediction._id = mongoose.Types.ObjectId();
        prediction.email = userItem.email;
        prediction.round = currentRound;
        prediction.predictions = [];
        fixtureList.forEach(fixtureItem => {
          console.log(`processing fixture ${fixtureItem}`);
          fixtureItem.homePrediction = 0;
          fixtureItem.awayPrediction = 0;
          prediction.predictions.push(fixtureItem)
        })
        console.log(`new prediction is ${prediction}`);
        db.collection('predictions').insertOne(prediction, function(err, r) {
          assert.equal(null, err);
          console.log(`Predictions inserted with result ${r}`);
        });
                // prediction.save(function(err) {
        //   if (err) {
        //     console.log("Error saving prediction  ", err);
        //   }
        //   console.log("Successfully inserted prediction")
        // })
      });
      client.close()
      });

  function getUsers(callback) {
    db.collection('accounts').find({}, {'_id' : false, 'email': true}).toArray(function(err, userList) {
    // Account.find({},{'_id' : false, 'email': true}, function(err,userList) {
      console.log("In getUsers callback");
      if (err) return console.error(err);
      var userCount = userList.length;
      console.log(`round ${currentRound} got ${userCount} results: ${userList}`);
      callback(null, userList);
    });
  };

  function getFixtures(userList, callback) {
    db.collection('fixtures').find({round : currentRound}).toArray(function(err, fixtureList) {
    // Fixture.find({round : currentRound}, function(err,fixtureList) {
      console.log("In getFixtures callback");
      if (err) return console.error(err);
      var fixtureCount = fixtureList.length;
      console.log(`I got this round ${currentRound} and ${fixtureCount} fixtures: ${fixtureList}`);
      callback(null, userList, fixtureList);
    });
  };
});
