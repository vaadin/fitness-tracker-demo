if (process.argv.length < 3) {
    console.log('Usage: node generate-data.js <weeknumber>');
    process.exit(1);
}

var moment = require('../../bower_components/moment/moment.js');
// Configure Moment.js to start the week on Monday.
moment.locale('en', {
     week: {
         dow: 1
     }
});

var sports = [
    {
        name: 'running',
        distance: {
            min: 3000,
            max: 21100
        },
        duration: {
            min: 25 * 60,
            max: 125 * 60
        },
        kcalPerHour: 900,
        applyAltitude: true
    }, {
        name: 'swimming',
        distance: {
            min: 500,
            max: 750
        },
        duration: {
            min: 30 * 60,
            max: 60 * 60
        },
        kcalPerHour: 500,
        applyAltitude: false
    }, {
        name: 'tennis',
        distance: {
            min: 0,
            max: 0
        },
        duration: {
            min: 25 * 60,
            max: 50 * 60
        },
        kcalPerHour: 570,
        applyAltitude: false
    }
];


function randomItem(arr) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}

function random(itemWithMinMax) {
    var result = Math.round(itemWithMinMax.max * Math.random());
    result = Math.max(itemWithMinMax.min, result);
    return result;
}

function randomMoment(monday) {
    return monday
        .clone()
        .add(Math.round(Math.random() * 7 * 24 * 60 * 60 * 1000), 'milliseconds');
}

function createWorkout(sport, monday) {
    var duration = random(sport.duration);
    var distance = random(sport.distance);
    var avgPace = distance === 0 ? 0 : Math.round(duration / (distance / 1000));
    var result = {
        date: randomMoment(monday),
        sport: sport.name,
        distance: distance,
        duration: duration,
        weather: randomItem([ "Rain", "Dry", "Fog" ]),
        humidity: 5,
        temperature: Math.round(Math.random() * 5 + 15),
        calories: Math.round(duration / 60 / 60 * sport.kcalPerHour),
        avgPace: avgPace,
        maxPace: avgPace + Math.round(Math.random() * 60),
        minAlt: 103,
        maxAlt: 122,
        ascent: -19
    };
    if (sport.applyAltitude) {
        var labels = [];
        for (var i = 0; i <= distance / 1000; i += distance / 1000 / 6) {
            labels.push(i.toFixed(1) + ' km');
        }
        result.speedData = {
            speed: [Math.round(Math.random() * 3 + 8), 9, 8, Math.round(Math.random() * 3 + 8), 10, 11, Math.round(Math.random() * 3 + 9)],
            altitude: [100, 103, 104, 113, 103, 92, 81],
            labels: labels
        };
    }
    return result;
}

var result = {
    weekNumber: process.argv[2],
    workouts: []
};
var monday = moment('2015-W' + result.weekNumber).startOf('week');

// Add at least one of each sport.
for (var i = 0; i < sports.length; i++) {
    result.workouts.push(createWorkout(sports[i], monday));
}
// Add random workouts.
var numberOfWorkouts = Math.round(Math.random() * 10 + 10);
for (var i = 0; i < numberOfWorkouts; i++) {
    result.workouts.push(createWorkout(randomItem(sports), monday));
}

console.log(JSON.stringify(result));
