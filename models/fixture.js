var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fixture = new Schema({
      _id : String,
      Round: Number,
      Date: Date,
      // roundClosed: Boolean,
      HomeTeam: String,
      HomeGoals: Number,
      AwayTeam: String,
      AwayGoals: Number,
      Location: String
});

module.exports = mongoose.model('Fixture', Fixture);
