var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Fixture = new Schema({
      _id : String,
      Round: Number,
      Date: Date,
      HomeTeam: String,
      HomeGoals: Number,
      AwayTeam: String,
      AwayGoals: Number,
      Location: String
});

module.exports = mongoose.model('Fixture', Fixture);
