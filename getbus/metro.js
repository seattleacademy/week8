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
    
    //console.log("current time" + data.currentTime); // auto convert to object 
    //console.dir(data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime,{depth:5});
    //predictedArrivalTime = data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime,{depth:5};
    //console.log("predicted" + predictedArrivalTime);
    
    console.log("stops away:" + data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway);
    numberOfStopsAway = data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway;

//var date = new Date(predictedArrivalTime - data.currentTime);
//console.log(predictedArrivalTime - data.currentTime);
//hour = date.getHours();
//minute = date.getMinutes();
//time = hour + ":" + minute;
//console.log("arrival" + time.toString());
});

