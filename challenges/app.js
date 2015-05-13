var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var physical = [];
physical.push("Stand up and do five jumping jacks");
physical.push("Get down and do five burpees");
physical.push("Do a plank for five seconds");
physical.push("Sit down and cross your legs and then stand back up twice");
physical.push("Do three sit ups");
physical.push("Run and touch seven chairs");

var mental = [];
mental.push("What is the cube root of one thousand three hundred and thirty one");
mental.push("What is the sum of the square root of sixty four and the cube root of sixty four");
mental.push("What is five factorial");
mental.push("Name four potato chip brands");
mental.push("Name four car companies");
mental.push("Name five presidents");
mental.push("Name six states");
mental.push("What is something that you can see. But if you put it in a barrel it would make the barrel lighter");
mental.push("As I was going to saint ives. I met upon seven wives. each wife had seven sacks. each sack had seven cats. each cat had seven kits kits cats sacks and wives how many people were going to saint ives");


function getRandomPhysical() {
    return physical[Math.floor(Math.random() * physical.length)];
}

function getRandomMental() {
    return mental[Math.floor(Math.random() * mental.length)];
}

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
            echoResponse.response.outputSpeech.text = "Would you like a physical or mental challenge"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            if (theRequest.request.type == 'IntentRequest') {
                choice = theRequest.request.intent.slots.Choice.value;
                echoResponse.response.outputSpeech.text = "I heard the choice " + choice;
                if(choice === "yes")
                {
                    echoResponse.response.shouldEndSession = "false";
                    echoResponse.response.outputSpeech.text = "Good job.  You get one point";
                }
                if(choice === "no")
                {
                    echoResponse.response.outputSpeech.text = "Too bad.  You get no points";
                }
                

                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Template Title";
                echoResponse.response.card.subtitle = "Template SubTitle";
                echoResponse.response.card.content = choice;
                echoResponse.sessionAttributes = {};
                echoResponse.response.shouldEndSession = "false";
            }

            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                if (choice === "physical"){

                    pChallenge = getRandomPhysical();
                    echoResponse.response.outputSpeech.text = pChallenge;
                    
                    // echoResponse.response.outputSpeech.text = "you said " + choice;
                
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = "Truth or Dare";
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = truth; 
                    
                    
                    echoResponse.response.outputSpeech.text += ".. Five.. Did you succeed";
                    echoResponse.response.shouldEndSession = "false";
                    //four.. three.. two.. one.. Time is up

                    // echoResponse.response{};
                    // echoResponse.response.outputSpeech = {};
                    // echoResponse.response.outputSpeech.type = "PlainText"
                    // echoResponse.response.shouldEndSession = "false";
                    // theRequest = JSON.parse(jsonString);

                    // console.log("It is here");
                    // if (theRequest.request.intent !== 'undefined') {
                    //     console.log("It is here 2", theRequest.request.intent);
                    //     choice = theRequest.request.intent.slots.Choice.value;
                    //     if(choice === "Yes")
                    //     {
                    //          echoResponse.response.shouldEndSession = "false";
                    //          echoResponse.response.outputSpeech.text = "Good job";
                    //     }
                    // }

                    // echoResponse.response.shouldEndSession = "true";
                }
                if (choice === "mental"){

                    mChallenge = getRandomMental();
                    echoResponse.response.outputSpeech.text = mChallenge;
                    // echoResponse.response.outputSpeech.text = "you said " + choice;
                
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = "Truth or Dare";
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = truth;
                    
                    echoResponse.response.outputSpeech.text = "Five.. four.. three.. two.. one.."
                    echoResponse.response.shouldEndSession = "true";
                }
            }
            sendResponse();
            console.dir(echoResponse, {depth: 5});

        });
    } else {
        sendResponse();
    }
}).listen(3018); //Put number in the 3000 range for testing and 443 for production