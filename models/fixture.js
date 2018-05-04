var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fixture = new Schema({
    Round: Number,
    fixtures: [
      {_id : false,
      homeTeam: String,
      awayTeam: String}
    ]
});

module.exports = mongoose.model('Fixture', Fixture);
