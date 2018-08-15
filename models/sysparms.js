var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Sysparms = new Schema({
    currentRound: String,
    currentMonth: Number
});

module.exports = mongoose.model('Sysparms', Sysparms);
