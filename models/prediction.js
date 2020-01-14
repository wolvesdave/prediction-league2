var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Prediction = new Schema({
    _id: mongoose.Schema.ObjectId,
    email: String,
    round: Number,
    predictions: [
      {_id : false,
      homeTeam: String,
      homePrediction: {type : Number, default : 0},
      awayTeam: String,
      awayPrediction: {type : Number, default : 0},
      joker: {type : Boolean, default : false},
      homeGoals : {type : Number, default : 0},
      awayGoals : {type : Number, default : 0},
      points : {type : Number, default : 0}}
    ]
});

module.exports = mongoose.model('Prediction', Prediction);
