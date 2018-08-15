var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Account = require('../models/account'),
    Sysparms = require('../models/sysparms'),
    Prediction = require('../models/prediction'),
    Fixture = require('../models/fixture'),
    http = require('http'),
    post = require('http-post'),
    mongoose = require('mongoose');
    async = require('async')

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
MongoClient.connect('mongodb://localhost:27017', function(err, client) {

  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db("prediction-league");
  var pred = new Prediction({email:"deleteme"});
  db.collection("predictions").save({pred}, function(err,doc){
    if (err) {
      console.log("Armchair ", err);
    }
    console.log("Whoopie! ", doc)
  })
  // var query = {_id:objectId};
  // Prediction.findByIdAndUpdate(query,pred,{upsert:true},function (err, newDoc){
  //   if (err) {
  //     console.log("Armchair ", err);
  //     return
  //   }
  //   console.log("Whoopie! ", newDoc)
  //   return
  // });
  console.log("WTF!!");
  return
});
