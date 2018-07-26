var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Prediction = new Schema({
    email: String,
    Round: Number,
    predictions: [
      {_id : false,
      homeTeam: String,
      homePrediction: Number,
      awayTeam: String,
      awayPrediction: Number,
      joker: Boolean}
    ]
});

module.exports = mongoose.model('Prediction', Prediction);
