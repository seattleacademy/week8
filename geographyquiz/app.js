var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};
var question,
    stateQuiz = [],
    enabled = [],
    stateCapitals = [
        ['montgomery', 'alabama', true],
        ['juneau', 'alaska', true],
        ['phoenix', 'arizona', true],
        ['little rock', 'arkansas', true],
        ["sacramento", "california", true],
        ["denver", "colorado", true],
        ["hartford", "connecticut", true],
        ["dover", "delaware", true],
        ["tallahassee", "florida", true],
        ["atlanta", "georgia", true]
    ];


https.createServer(options, function(req, res) {
    function sendResponse() {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }

    function randomQuestion() {
        qnumber = Math.floor(Math.random() * stateCapitals.length);
    }

    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {
                depth: 5
            });
            theRequest = JSON.parse(jsonString);

            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};


            echoResponse.response.outputSpeech.type = "PlainText";
            if (theRequest.request.type == 'LaunchRequest')
                randomQuestion();
            echoResponse.response.outputSpeech.text = "What is the capital of " + stateCapitals[qnumber][1]
            echoResponse.response.shouldEndSession = "false";

            echoResponse.sessionAttributes = {
                'qnumber': qnumber
            };
            console.log("echoResponse", echoResponse)
            if (theRequest.request.type == 'IntentRequest') {
                echoResponse.response.shouldEndSession = "false";
                choice = theRequest.request.intent.slots.Choice.value;
                qnumber = theRequest.session.attributes.qnumber;
                correctanswer = stateCapitals[qnumber][1];
                correctcapital = stateCapitals[qnumber][0];
                console.log(choice, qnumber, correctcapital, correctanswer)
                if (choice = correctcapital) {
                    choice = theRequest.request.intent.slots.Choice.value;
                    echoResponse.response.outputSpeech.text = "Yes, the capital of " + correctanswer + " is " + correctcapital;
                    echoResponse.response.shouldEndSession = "false";
                }

                if (choice != correctcapital) {
                    echoResponse.response.outputSpeech.text = "No, the capital of " + correctanswer + " is " + correctcapital;
                    echoResponse.response.shouldEndSession = "false";

                }
                randomQuestion();
                echoResponse.sessionAttributes = {
                    'qnumber': qnumber
                };
                echoResponse.response.outputSpeech.text += ".   What is the capital of " + stateCapitals[qnumber][1]
            }


            sendResponse();
            console.dir(echoResponse, {
                depth: 5
            });

        });
    } else {
        sendResponse();
    }
}).listen(3007); //Put number in the 3000 range for testing and 443 for production
