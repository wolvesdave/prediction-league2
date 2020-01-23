var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    fullname: String,
    password: String,
    email : String,
    jokers : Number,
    totalScore : {type: Number, default:0},
    monthlyScore : [
      { month : String,
      score : Number,
      _id : false }
    ],
     weeklyScore : [
       {round : Number,
       score : Number,
       _id : false}
       ]
},{ usePushEach: true });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
