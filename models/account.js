var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    fullname: String,
    password: String,
    email : String,
    totalScore : Number,
    weeklyScore : [ {score : Number} ],
    monthlyScore : [
      { month : String,
      score : Number }
     ]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
