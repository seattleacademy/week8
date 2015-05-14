var elizabot = require('./elizabot.js');
var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};


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
            echoResponse.response.outputSpeech.text = elizabot.start()
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            if (theRequest.request.type == 'IntentRequest') {
                choice = theRequest.request.intent.slots.Choice.value;
                console.log("choice", choice)
                echoResponse.response.outputSpeech.text = elizabot.reply(choice)
                if (choice === "goodbye"){ 
                    echoResponse.response.outputSpeech.text = elizabot.bye()
                    echoResponse.response.shouldEndSession = "true";
                } 
                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Psychologist";
                echoResponse.response.card.subtitle = choice;
                echoResponse.response.card.content = echoResponse.response.outputSpeech.text;
                echoResponse.sessionAttributes = {};
                
            }
            sendResponse();
            //console.dir(echoResponse, {depth: 5});

        });
    } else {
        sendResponse();
    }
}).listen(3011); //Put number in the 3000 range for testing and 443 for production
