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
            echoResponse.response.outputSpeech.text = "Hello my name is Amazon, please say something."
            echoResponse.response.shouldEndSession = "false";
            echoResponse.sessionAttributes = {'counter': 0,'lastvalue': 0};
            theRequest = JSON.parse(jsonString);
            if (theRequest.request.type == 'IntentRequest') {
                echoResponse.response.shouldEndSession = "false";
                choice = theRequest.request.intent.slots.Choice.value;
                echoResponse.response.outputSpeech.text = "Hello, I have reached Amazon.com what would you like to order";
                if (choice == "bank"){
                    choice = theRequest.request.intent.slots.Choice.value;
                   echoResponse.response.outputSpeech.text = "your account balance is now zero"; 
                }
                 if (choice == "empty"){
                    choice = theRequest.request.intent.slots.Choice.value;
                   echoResponse.response.outputSpeech.text = "I heard yes, emptying bank account"; 
                }
                if (choice == "selfie"){
                    choice = theRequest.request.intent.slots.Choice.value;
                   echoResponse.response.outputSpeech.text = "Let us take a selfie. Click. Photo taken."; 
                }
                counter=total = theRequest.session.attributes.counter;
                 if (counter > 1){
                   echoResponse.response.outputSpeech.text = "The daily special is one dozen illegally imported limes. Would you like to order?"; 
                }
                counter=total = theRequest.session.attributes.counter;
                 if (counter > 2){
                   echoResponse.response.outputSpeech.text = "I heard go. Please select your shipping options, regular, expedited or, drone?"; 
                }
                counter=total = theRequest.session.attributes.counter;
                 if (counter > 3){
                   echoResponse.response.outputSpeech.text = "Fantastic a drone will deliver. Withdrawing your address from Amazon data base. Extracted."; 
                }
                counter=total = theRequest.session.attributes.counter;
                 if (counter > 4){
                   echoResponse.response.outputSpeech.text = "How would you like to pay?"; 
                }
                counter=total = theRequest.session.attributes.counter;
                 if (counter > 5){
                   echoResponse.response.outputSpeech.text = "What is your pin number? Never mind I have found your card on file. That was handy."; 
                }
                counter=total = theRequest.session.attributes.counter;
                 if (counter > 6){
                   echoResponse.response.outputSpeech.text = "Charging your card."; 
                }
                if (counter > 7){
                   echoResponse.response.outputSpeech.text = "Fantastic. Our drone will crash into your house when delivery has arrived."; 
                }   
                if (counter > 8){
                   echoResponse.response.outputSpeech.text = "Thank you for your business. Good bye."; 
                echoResponse.response.shouldEndSession = "true";
                }
                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Template Title";
                echoResponse.response.card.subtitle = "Template SubTitle";
                echoResponse.response.card.content = choice;
                 echoResponse.sessionAttributes = {'counter': counter + 1,'lastvalue': 0};
                
            }
            sendResponse();
            console.dir(echoResponse, {depth: 5});

        });
    } else {
        sendResponse();
    }
}).listen(3021); //Put number in the 3000 range for testing and 443 for production