var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Predictions = new Schema({
    email: String,
    name: String,
    homeTeam: String,
    homeScore: Number,
    awayTeam: String,
    awayScore: Number,
    Round: Number
});

module.exports = mongoose.model('Predictions', Predictions);
