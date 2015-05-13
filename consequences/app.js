var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var rewards = [];
rewards.push("Eat a piece of candy.");
rewards.push("Listen to your favorite music.");
rewards.push("Do 10 math problems of Gary's choice.");
rewards.push("Take 5 dollars from the friend of your choice.");
rewards.push("Take a nap.");
rewards.push("Go home early.");
rewards.push("Bow down to Gary.");
rewards.push("Launch the missiles.");
rewards.push("Buy another Amazon Echo.");


var punishments = [];
punishments.push("Do 15 push ups.");
punishments.push("Sit in the corner.");
punishments.push("Do 500 jumping jacks.");
punishments.push("Cut off one finger for each problem you got wrong on your last math test.");
punishments.push("Bow down to Gary.");
punishments.push("Run to Q. F. C. and get me lunch.");
punishments.push("Transfer to geometry.");
punishments.push("Reorganize the class note card.");
punishments.push("Ree do all your I love algebra problems.");

var compliments = [];
compliments.push("I like your hair.");
compliments.push("You're Gary's favorite student.");
compliments.push("Nice outfit today!");
compliments.push("You're a good person.");
compliments.push("You should come in here more. I like you.");

var insults = [];
insults.push("You're fat.");
insults.push("I hate you.");
insults.push("Really? You're wearing those shoes?");
insults.push("I bet you go to the store to buy things like a looser instead of ordering from Amazon.");
insults.push("You won't be smiling when you see your grade.");
insults.push("No one likes you.");
insults.push("I bet you don't have any friends. . . Not any real ones, anyway.");
insults.push("You're a sad excuse of a math student.");
insults.push("You don't deserve me.");
insults.push("You're a smuck.");



function getRandomReward() {
    return rewards[Math.floor(Math.random() * rewards.length)];
}

function getRandomPunishment() {
    return punishments[Math.floor(Math.random() * punishments.length)];
}

function getRandomCompliment() {
    return compliments[Math.floor(Math.random() * compliments.length)];
}

function getRandomInsult() {
    return insults[Math.floor(Math.random() * insults.length)];
}


https.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {
                depth: 5
            });
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};


            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "Do you want a reward or a punishment? Do you want a compliment or an insult?"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            console.log('JSON', theRequest.request);
            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                    if(choice === "reward"){
                    reward = getRandomReward();
                    echoResponse.response.outputSpeech.text = reward;
                    //echoResponse.response.outputSpeech.text = "you said " + choice;
                    // echoResponse.response.card = {}
                    // echoResponse.response.card.type = "PlainText";
                    // echoResponse.response.card.title = choice;
                    // echoResponse.response.card.subtitle = choice;
                    // echoResponse.response.card.content = choice;
                    echoResponse.response.shouldEndSession = "true";
                }

                    if(choice === "punishment"){
                    punishment = getRandomPunishment();
                    echoResponse.response.outputSpeech.text = punishment;
                    echoResponse.response.shouldEndSession = "true";
                }

                 if(choice === "compliment"){
                    compliment = getRandomCompliment();
                    echoResponse.response.outputSpeech.text = compliment;
                    echoResponse.response.shouldEndSession = "true";
                }

                 if(choice === "insult"){
                    insult = getRandomInsult();
                    echoResponse.response.outputSpeech.text = insult;
                    echoResponse.response.shouldEndSession = "true";
                }
            }
            
            // echoResponse.response.outputSpeech.text = "Do you want me to continue?"
            // echoResponse.response.shouldEndSession = "false";

            // if(choice === "yes"){nj.
                    
            //         echoResponse.response.outputSpeech.text = "Do you want a reward or a punishment? Do you want a compliment or an insult?"
            //         echoResponse.response.shouldEndSession = "false";
                    

            // }

            // if(choice === "no"){
            //         echoResponse.response.shouldEndSession = "true";

            // }

            myResponse = JSON.stringify(echoResponse);
            res.setHeader('Content-Length', myResponse.length);
            res.writeHead(200);
            res.end(myResponse);
            console.log('from post', myResponse);


        });

            
            


    } else {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
}).listen(3022); //my number is 3022, and the name of the project is omega.