var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Prediction = new Schema({
    _id: mongoose.Schema.ObjectId,
    email: String,
    Round: Number,
    predictions: [
      {_id : false,
      HomeTeam: String,
      HomePrediction: {type : Number, default : 0},
      AwayTeam: String,
      AwayPrediction: {type : Number, default : 0},
      joker: {type : Boolean, default : false},
      HomeGoals : {type : Number, default : 0},
      AwayGoals : {type : Number, default : 0}}
    ]
});

module.exports = mongoose.model('Prediction', Prediction);
