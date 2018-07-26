var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fixture = new Schema({
    Round: Number,
    roundClosed: Boolean,
    fixtures: [
      {_id : false,
      homeTeam: String,
      homeScore: Number,
      awayTeam: String
      awayScore: Number,
      matchDate: Date}
    ]
});

module.exports = mongoose.model('Fixture', Fixture);
