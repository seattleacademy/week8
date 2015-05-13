var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};


var rest = require('restler');

//See https://github.com/srt4/OneBusAway-Node-Client
var OBA_API_URL = 'http://api.onebusaway.org/api/where/';
var OBA_KEY = 'key=14f3bc28-6c02-4257-8a36-b1eaac4122aa';
//Find stops at http://pugetsound.onebusaway.org/where/standard/#m(route)route(1_102581)
var stopId = "3160";
//for some reason, we need to add this
stopId = "1_" + stopId;


stopurl = OBA_API_URL + 'arrivals-and-departures-for-stop/' + stopId + '.json?' + OBA_KEY;

https.createServer(options, function(req, res) {
    function sendResponse() {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {depth: 5});
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};

            echoResponse.response.outputSpeech.type = "PlainText"
            rest.get(stopurl).on('complete', function(data) {
                console.dir(data,{depth:5})

                console.log("stops away:" + data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway);
                numberOfStopsAway = data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway;
                console.log("numberOfStopsAway", numberOfStopsAway);
                echoResponse.response.outputSpeech.text = "The number of stops away is" + numberOfStopsAway;
                echoResponse.response.shouldEndSession = "true";
                sendResponse();
                return numberOfStopsAway;
            });
        });
    } else {
        sendResponse();
    }
}).listen(3005); //Put number in the 3000 range for testing and 443 for production
