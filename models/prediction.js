var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Prediction = new Schema({
    email: String,
    name: String,
    Round: Number,
    predictions: [
      {_id : false,
      homeTeam: String,
      homeScore: Number,
      homePrediction: Number,
      awayTeam: String,
      awayScore: Number,
      awayPrediction: Number,
      joker: Boolean}
    ]
});

module.exports = mongoose.model('Prediction', Prediction);
