var rest = require('restler');

//See https://github.com/srt4/OneBusAway-Node-Client
var OBA_API_URL = 'http://api.onebusaway.org/api/where/';
var OBA_KEY = 'key=14f3bc28-6c02-4257-8a36-b1eaac4122aa';
//Find stops at http://pugetsound.onebusaway.org/where/standard/#m(route)route(1_102581)
var stopId = "3160";
//for some reason, we need to add this
stopId = "1_" + stopId;


stopurl = OBA_API_URL + 'arrivals-and-departures-for-stop/' + stopId + '.json?' + OBA_KEY;

rest.get(stopurl).on('complete', function(data) {
    //console.dir(data,{depth:5})
    console.dir(data,{depth:5})
    //See http://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-js
    console.log(data.currentTime); // auto convert to object 
    console.dir(data.data.entry.arrivalsAndDepartures.predictedArrivalTime,{depth:5});

var date = new Date(data.currentTime);
hour = date.getHours();
minute = date.getMinutes();
time = hour + ":" + minute;
console.log(time.toString());
});

