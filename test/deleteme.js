var query = {"email" : req.user.email, "Round": req.user.round};
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
	"Round" : 1,
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

db.predictions.findOneAndUpdate({email:"wolvesdave@gmail.com", Round: 1}, {$set: { predictions :
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

  db.predictions.insertOne({email:"wolvesdave@gmail.com", Round:1, predictions : [
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
query = { email: 'wolvesdave@gmail.com', Round: 1 }


{
	"_id" : ObjectId("5adf6880ec247b2eb0e627a8"),
	"email" : "wolvesdave@gmail.com",
	"Round" : 1,
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
