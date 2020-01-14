var query = {"email" : req.user.email, "round": req.user.round};
var pred = {homeTeam: [ 'Wolves', 'Man U', 'Man U', 'Leicester', 'Wolves', 'Leicester' ],
    homePrediction: [ '2', '3', '0', '0', '1', '0' ],
    awayTeam: [ 'Albion', 'Arsenal', 'Arsenal', 'Villa', 'Albion', 'Villa' ],
    awayPrediction: [ '1', '3', '0', '0', '0', '2' ],
    homeScore: [ '2', '1', '1', '0', '2', '0' ],
    awayScore: [ '0', '2', '2', '4', '0', '4' ],
    joker: [ '0', '0', '0', '0', '0', '0' ] });

Prediction.findOneAndUpdate(query, {$set: { prediction : pred }}, {upsert:true}, function(err, doc){
    if (err) return console.error("Save Failed: ", err);
    console.log("Save worked!");
});


Prediction.findById(id, function (err, tank) {
  if (err) return handleError(err);

  tank.size = 'large';
  tank.save(function (err, updatedTank) {
    if (err) return handleError(err);
    res.send(updatedTank);
  });
});

db.predictions.insertOne({
	"email" : "wolvesdave@gmail.com",
	"name" : "David Koppe",
	"round" : 1,
  "predictions": {homeTeam: [ 'Wolves', 'Man U', 'Man U', 'Leicester', 'Wolves', 'Leicester' ],
  homePrediction: [  ],
  awayTeam: [ 'Albion', 'Arsenal', 'Arsenal', 'Villa', 'Albion', 'Villa' ],
  awayPrediction: [  ],
  homeScore: [  ],
  awayScore: [  ],
  joker: [  ] }
});

db.predictions.updateOne({email:"wolvesdave@gmail.com"},{$set: {predictions : [
{"homeTeam" : "Arsenal", "awayTeam" : "Everton"},
{"homeTeam" : "Aston Villa", "awayTeam" : "Liverpool"},
{"homeTeam" : "Burnley", "awayTeam" : "Brighton & Hove Albion"},
{"homeTeam" : "Chelsea", "awayTeam" : "Huddersfield"},
{"homeTeam" : "Crystal Palace", "awayTeam" : "Leicester City"},
{"homeTeam" : "Manchester City", "awayTeam" : "West Ham"},
{"homeTeam" : "Manchester United", "awayTeam" : "Tottenham Hotspur"},
{"homeTeam" : "Newcastle United", "awayTeam" : "Swansea City"},
{"homeTeam" : "Watford", "awayTeam" : "Bournemouth"},
{"homeTeam" : "Wolves", "awayTeam" : "Fulham"}
]}});

db.predictions.findOneAndUpdate({email:"wolvesdave@gmail.com", round: 1}, {$set: { predictions :
[ { homeTeam: 'Arsenal',
    homePrediction: '1',
    awayTeam: 'Everton',
    awayPrediction: '1',
    joker: '0' },
  { homeTeam: 'Aston Villa',
    homePrediction: '1',
    awayTeam: 'Liverpool',
    awayPrediction: '1',
    joker: '1' },
  { homeTeam: 'Burnley',
    homePrediction: '1',
    awayTeam: 'Brighton & Hove Albion',
    awayPrediction: '1',
    joker: '0' },
  { homeTeam: 'Chelsea',
    homePrediction: '1',
    awayTeam: 'Huddersfield',
    awayPrediction: '1',
    joker: '1' },
  { homeTeam: 'Crystal Palace',
    homePrediction: '1',
    awayTeam: 'Leicester City',
    awayPrediction: '1',
    joker: '0' },
  { homeTeam: 'Manchester City',
    homePrediction: '1',
    awayTeam: 'West Ham',
    awayPrediction: '1',
    joker: '0' },
  { homeTeam: 'Manchester United',
    homePrediction: '1',
    awayTeam: 'Tottenham Hotspur',
    awayPrediction: '1',
    joker: '0' },
  { homeTeam: 'Newcastle United',
    homePrediction: '1',
    awayTeam: 'Swansea City',
    awayPrediction: '1',
    joker: '1' },
  { homeTeam: 'Watford',
    homePrediction: '1',
    awayTeam: 'Bournemouth',
    awayPrediction: '1',
    joker: '0' },
  { homeTeam: 'Wolves',
    homePrediction: '1',
    awayTeam: 'Fulham',
    awayPrediction: '1',
    joker: '0' } ]}}, {upsert:true});

  db.predictions.insertOne({email:"wolvesdave@gmail.com", round:1, predictions : [
    {"homeTeam" : "Arsenal", "awayTeam" : "Everton"},
    {"homeTeam" : "Aston Villa", "awayTeam" : "Liverpool"},
    {"homeTeam" : "Burnley", "awayTeam" : "Brighton & Hove Albion"},
    {"homeTeam" : "Chelsea", "awayTeam" : "Huddersfield"},
    {"homeTeam" : "Crystal Palace", "awayTeam" : "Leicester City"},
    {"homeTeam" : "Manchester City", "awayTeam" : "West Ham"},
    {"homeTeam" : "Manchester United", "awayTeam" : "Tottenham Hotspur"},
    {"homeTeam" : "Newcastle United", "awayTeam" : "Swansea City"},
    {"homeTeam" : "Watford", "awayTeam" : "Bournemouth"},
    {"homeTeam" : "Wolves", "awayTeam" : "Fulham"}
  ]});

var Prediction = require('../models/prediction');
Prediction.findOne({query})
query = { email: 'wolvesdave@gmail.com', round: 1 }


{
	"_id" : ObjectId("5adf6880ec247b2eb0e627a8"),
	"email" : "wolvesdave@gmail.com",
	"round" : 1,
	"predictions" : [
		{
			"homeTeam" : "Arsenal",
			"awayTeam" : "Everton"
		},
		{
			"homeTeam" : "Aston Villa",
			"awayTeam" : "Liverpool"
		},
		{
			"homeTeam" : "Burnley",
			"awayTeam" : "Brighton & Hove Albion"
		},
		{
			"homeTeam" : "Chelsea",
			"awayTeam" : "Huddersfield"
		},
		{
			"homeTeam" : "Crystal Palace",
			"awayTeam" : "Leicester City"
		},
		{
			"homeTeam" : "Manchester City",
			"awayTeam" : "West Ham"
		},
		{
			"homeTeam" : "Manchester United",
			"awayTeam" : "Tottenham Hotspur"
		},
		{
			"homeTeam" : "Newcastle United",
			"awayTeam" : "Swansea City"
		},
		{
			"homeTeam" : "Watford",
			"awayTeam" : "Bournemouth"
		},
		{
			"homeTeam" : "Wolves",
			"awayTeam" : "Fulham"
		}
	]
}

input(type="hidden" name="joker" value="0")
input(type="checkbox" onclick="this.previousSibling.value=1-this.previousSibling.value")

form(role='form', action="/predictions", method="post")
  div(ng-controller="predictionController")

  db.predictions.find({}).forEach( function(doc) {
  var arr = doc.predictions;
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    delete arr[i]["_id"];
  }
  db.predictions.save(doc);
});

db.predictions.findOneAndUpdate({email: "wolvesdave@gmail.com"},{$set: {
"predictions" : [
  {
    "homeTeam" : "Arsenal",
    "homePrediction" : 3,
    "awayTeam" : "Everton",
    "awayPrediction" : 1,
    "joker" : true
  },
  {
    "homeTeam" : "Wolves",
    "homePrediction" : 5,
    "awayTeam" : "Villa",
    "awayPrediction" : 1,
    "joker" : false
  }
]}});

> db.fixtures.find().pretty()
{ "_id" : ObjectId("5aea4b2ed2cefab7a3033ce0"), "fixtures" : [ ] }
{
	"_id" : ObjectId("5aea4e73d2cefab7a3033ce1"),
	"round" : 1,
	"fixtures" : [
		{
			"homeTeam" : "wolves",
			"awayTeam" : "villa"
		},
		{
			"homeTeam" : "Man U",
			"awayTeam" : "Arsenal"
		},
		{
			"homeTeam" : "Chelseas",
			"awayTeam" : "Burnley"
		}
	]
}
{
	"_id" : ObjectId("5aeb709e4b8bb31dcce444f2"),
	"round" : 2,
	"fixtures" : [
		{
			"homeTeam" : "a",
			"awayTeam" : "v"
		},
		{
			"homeTeam" : "d",
			"awayTeam" : "c"
		}
	],
	"__v" : 0
}
>
[
  {"_id":"380441","round":19,"Date":"2017-12-17T12:30:00+00:00","homeTeam":"Hearts","homeGoals":4,"awayTeam":"Celtic","awayGoals":0,"Location":"Tynecastle Stadium"},
  {"_id":"380443","round":19,"Date":"2017-12-16T15:00:00+00:00","homeTeam":"Rangers","homeGoals":1,"awayTeam":"St Johnstone","awayGoals":3,"Location":"Ibrox Stadium"},
  {"_id":"380442","round":19,"Date":"2017-12-16T15:00:00+00:00","homeTeam":"Kilmarnock","homeGoals":1,"awayTeam":"Motherwell","awayGoals":0,"Location":"Rugby Park"},
  {"_id":"380440","round":19,"Date":"2017-12-16T15:00:00+00:00","homeTeam":"Hamilton","homeGoals":3,"awayTeam":"Ross County","awayGoals":2,"Location":"New Douglas Park"},
  {"_id":"380439","round":19,"Date":"2017-12-16T15:00:00+00:00","homeTeam":"Dundee FC","homeGoals":3,"awayTeam":"Partick","awayGoals":0,"Location":"Dens Park"},
  {"_id":"380438","round":19,"Date":"2017-12-16T12:30:00+00:00","homeTeam":"Aberdeen","homeGoals":4,"awayTeam":"Hibernian","awayGoals":1,"Location":"Pittodrie Stadium"}
]

.error(function (data, status) {
    console.log(data);
});

.error(function (data, status) {
    console.log(data);
});
