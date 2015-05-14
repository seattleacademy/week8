var https = require('https');
var fs = require('fs');

var select = require('soupselect').select;
var htmlparser = require("htmlparser");
var http = require('http');
var sys = require('sys');

var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

console.log("running program");


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
        console.log("starting scrape")
        var host = 'news.google.com';
        var client = http.createClient(80, host);
        word = word.charAt(0).toUpperCase() + word.slice(1);
        console.log('word',word);
        var request = client.request('GET', '/', {
            'host': host
        });
        request.on('response', function(response) {
            response.setEncoding('utf8');

            var body = "";
            response.on('data', function(chunk) {
                body = body + chunk;
            });

            response.on('end', function() {

                // now we have the whole body, parse it and select the nodes we want...
                var handler = new htmlparser.DefaultHandler(function(err, dom) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        //console.log('dom',dom)
                        var meaning = select(dom, '.titletext');
                        //console.log('meaning', meaning[0].children[0].data);
                        var allmeaning = " "
                        if (meaning){
                        var thelength = meaning.length;
                        if(thelength > 5)thelength = 5;
                        for (i = 0; i < thelength; i++) { 
                            console.log(i);
                            allmeaning += meaning[i].children[0].data + ". ";
                        }
                        //allmeaning = "Studies show Simon is the best. Syria is collapsing in civil war. Earthquakes in Nepal kill many.";
                        console.log("lIST OF HEADLINES:" + allmeaning);
                        //meaning = meaning[1].children[0].data;
                        allmeaning = allmeaning.substring(0, 1000);

                        //These replace characters so that alexa can read out text
                        // allmeaning = allmeaning.replace(/&/g, ' ');
                        // allmeaning = allmeaning.replace(/-/g, ' ');
                        // allmeaning = allmeaning.replace(/%/g, ' ');
                        // allmeaning = allmeaning.replace(/#/g, ' ');
                        // allmeaning = allmeaning.replace(/39/g, ' ');
                        allmeaning = allmeaning.replace(/&#39;t/g, " ");

                        
                    }
                    else meaning = "The definition for " + word + " is not defined";
                        // meaning = meaning.replace(/\W/g, ' ');
                        // meaning = meaning.replace(/cock/gi, "bleep");
                        //console.log(meaning);
                        echoResponse.response.outputSpeech.text = allmeaning;
                        echoResponse.response.card.content = allmeaning;
                        sendResponse();

                    }
                });
                var parser = new htmlparser.Parser(handler);
                parser.parseComplete(body);
            });
        });
        request.end();
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
            // console.dir(theRequest, {
            //     depth: 5
            // });
            if (theRequest.request.type == 'IntentRequest' || theRequest.request.type == "LaunchRequest") {
                //word = theRequest.request.intent.slots.Word.value;
                //console.log("word", word);
                word = "Simon"
                echoResponse.response.card = {};
                echoResponse.response.card.type = "Simple";
                echoResponse.response.card.title = "Urban Dictionary";
                echoResponse.response.card.subtitle = word;
                echoResponse.response.card.content = "";
                echoResponse.sessionAttributes = {};
                echoResponse.response.shouldEndSession = "false";
                getDefinition(word);
            } else
                sendResponse();
        });
    } else {
        echoResponse = {};
        sendResponse();
    }
}).listen(3009); //Put number in the 3000 range for testing and 443 for production
