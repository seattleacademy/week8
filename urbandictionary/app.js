var https = require('https');
var fs = require('fs');


var rest = require('restler');

var select = require('soupselect').select;
var htmlparser = require("htmlparser");
//var http = require('http');
var http = require('follow-redirects').http;
var sys = require('sys');

var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};


https.createServer(options, function(req, res) {

    function sendResponse() {
        myResponse = JSON.stringify(echoResponse);
        console.log(myResponse, {
            depth: 5
        });
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }

    function getDefinition(word) {

        console.log('word', word);

        rest.get('http://www.urbandictionary.com/define.php?term='+word).on('complete', function(body) {
            //console.log(body);
            var handler = new htmlparser.DefaultHandler(function(err, dom) {
                if (err) {
                    console.log("Error: " + err);
                } else {
                    //console.log('dom',dom)
                    var meaning = select(dom, '.meaning');
                    //console.log('meaning', meaning[0].children[0]);
                    if (typeof meaning[0] !== 'undefined') { //Note Lock is not defined, for example
                        meaning = meaning[0].children[0].data;
                    } else meaning = "The definition for " + word + " is not defined";
                    meaning = meaning.replace(/&#39;/g, "'"); //replace character code for quote with '
                    //meaning = meaning.replace(/\W/g, ' ');
                    originalmeaning = meaning; 
                    mearning = meaning.replace(/fuck/gi, "sexual intercourse");
                    meaning = meaning.replace(/cock/gi, "heart");
                    meaning = meaning.replace(/penis/gi, "heart");
                    meaning = meaning.replace(/ball/gi, "brain");
                    meaning = meaning.replace(/breast/gi, "eye");
                    meaning = meaning.replace(/lesbian/gi, "woman");
                    console.log(meaning);
                    //if meaning !=== oldmeaning we may noot want to read at all.
                    echoResponse.response.outputSpeech.text = mearning;
                    echoResponse.response.card.content = meaning;
                    sendResponse();
                }
            });
            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(body);
        });
    }

    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};

            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "ok"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            if(typeof theRequest.session.new != 'undefined')
                echoResponse.sessionAttributes = {'count':0,'lastword':''};
            // console.dir(theRequest, { depth: 5});
            if (theRequest.request.type == 'IntentRequest') {
                word = "blank";
                if (typeof theRequest.request.intent.slots.Word !== 'undefined')
                    word = theRequest.request.intent.slots.Word.value;
                if (typeof theRequest.request.intent.slots.Choice !== 'undefined')
                    word = theRequest.request.intent.slots.Choice.value;

                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Urban Dictionary";
                echoResponse.response.card.subtitle = word;
                echoResponse.response.card.content = "";
                total = Number(theRequest.session.attributes.count) + 1;
                echoResponse.sessionAttributes = {'count':0,'lastword':word};
                echoResponse.response.shouldEndSession = "false";
                getDefinition(word);
            } else
                sendResponse();
        });
    } else {
        echoResponse = {};
        sendResponse();
    }
}).listen(3028); //Put number in the 3000 range for testing and 443 for production
