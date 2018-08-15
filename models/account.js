var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    fullname: String,
    password: String,
    email : String,
    totalScore : {type: Number, default:0},
    weeklyScore : [ {score : Number} ],
    monthlyScore : [
      { month : String,
      score : Number }
     ]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
