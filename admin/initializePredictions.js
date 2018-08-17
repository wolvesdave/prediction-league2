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

// MongoClient.connect('mongodb://localhost:27017', function(err, client) {

  // assert.equal(null, err);
  // console.log("Connected successfully to server");
  // const db = client.db("prediction-league");

  async.waterfall([
      getSysparms,
      getUsers,
      getFixtures,
  ], function (err, currentRound, userList, fixtureList) {
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
        // db.collection("predictions").save({prediction}, function(err,doc){
        //   if (err) {
        //     console.log("Error saving prediction  ", err);
        //   }
        //   console.log("Successfully inserted prediction ", doc)
        // })
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
    // db.collection('sysparms').findOne({}, function(err,r) {
    //   console.log("In getSysparms callback");
    //   if (err) return console.error(err);
    //   console.log(r);
    //   var round = r.currentRound;
    //   console.log("Round is ", round);
    //   callback(null, round);
    //   });
  };

  function getUsers(currentRound, callback) {
    Account.find({},{'_id' : false, 'email': true}, function(err,userList) {
      console.log("In getUsers callback");
      if (err) return console.error(err);
      console.log("round ", currentRound, " got these results: ", userList);
      callback(null, currentRound, userList);
    });
  };

  function getFixtures(currentRound, userList, callback) {
    Fixture.find({Round : currentRound}, function(err,fixtureList) {
      console.log("In getUsers callback");
      if (err) return console.error(err);
      console.log("I got this round ", currentRound, " and these users: ", userList);
      callback(null, currentRound, userList, fixtureList);
    });
  };

  //  for (var i = 0, len = userList.length; i < len; i++) {
  //   prediction = {
  //     "_id" : inputmatches[i].Id[0],
  //     "Round" : parseInt(inputmatches[i].Round[0]),
  //     "Date" : inputmatches[i].Date[0],
  //     "HomeTeam" : inputmatches[i].HomeTeam[0],
  //     "HomeGoals" : homegoals,
  //     "AwayTeam" : inputmatches[i].AwayTeam[0],
  //     "AwayGoals" : awaygoals,
  //     "Location" : inputmatches[i].Location[0]
  //   }
  //   outputmatches.push(match);
  // };
  //
  // Prediction.update(query, newFixture,
  //   {overwrite: true, upsert : true},
  //   function(err, result) {
  //     if (err) return console.error(err);
  //     console.log("Modified fixture: ", result);
  //     res.send(result);
  // });
// });
