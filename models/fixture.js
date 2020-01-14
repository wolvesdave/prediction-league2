var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Fixture = new Schema({
      _id : String,
      round: Number,
      Date: Date,
      homeTeam: String,
      homeGoals: Number,
      awayTeam: String,
      awayGoals: Number,
      Location: String
});

module.exports = mongoose.model('Fixture', Fixture);
