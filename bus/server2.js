/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 30/9/12
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var path = require("path");
var fs = require("fs");
var mongoHandle = require("./mymongo").connect();
var actionAPI = require("./actionapi");
var myEvents = require("./myevent");

var test = eval('myEvents.init');
test();

var requestQueue = [];
var contentTypes = {
    '.js' : 'text/javascript',
    '.css':'text/css',
    '.htm':'text/html',
    '.html':'text/html'
};

var server = http.createServer(function(request, response){

    if(request.method == "GET"){
        get(request, response);
    }
    if(request.method == "POST"){
        post(request, response);
    }
});

server.listen(1337);
console.log("Web server is ready to listen U @ http://localhost:1337\n");

function get(request, response){

    var filePath = '.' + request.url;
    if(filePath == './') filePath = "./markup.html";

    var fileExtension = path.extname(filePath);

    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function (error, fileContent){
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                var contentType = contentTypes[fileExtension] || 'text/plain';
                response.writeHead(200, {'contentType': contentType});
                response.end(fileContent, 'utf-8');
            });
        }
        else{
            response.writeHead(404);
            response.end();
        }
    });
}

function post(request, response){
    var data = '';

    request.on('data', function(chunk) {
        data += chunk;
    });
    request.on('end', function() {
        try{
            var jData = JSON.parse(data);
            requestQueue[jData.requestId] = jData;
            requestQueue[jData.requestId].request = request;
            requestQueue[jData.requestId].response = response;
        }
        catch(ex){
            response.writeHead(500, {'content-type': 'text/plain' });
            response.write('error: ' + ex);
            response.end();
        }
    }); //addListener
}

var interval = setInterval(function(){requestProcess();}, 2000);

function requestProcess(){
    var key = null;

    for(key in requestQueue){
        if(requestQueue[key].status == "requesting"){
            requestQueue[key].status = "requested";
            console.log('request#' + requestQueue[key].requestId + '  forwarded.');
            requestForward(requestQueue[key]);
            break;
        }
    }
}

function requestForward(data){
    var collection = '';

    var service = eval('actionAPI.' + data.call.name);
    if(service){
        service(mongoHandle, data, function(){
            callback(data);
        });
    }else{
        state.error('Unable to determine a call handler for "' + state.call.name + '".');
        callback(data);
    }
}

function requestSubscription(data){
    console.log('actionAdd: triggered actionAdded event.');
    var collection = '';
    data.call.name = "actionAddRecommendation";
    var service = eval('actionAPI.' + data.call.name);
    if(service){
        service(mongoHandle, data, function(){
            callback(data);
        });
    }else{
        state.error('Unable to determine a call handler for "' + state.call.name + '".');
        callback(data);
    }
}

function callback(data){
    try{
        //Events...which all systems or sub-systems need this information or already subscribed for..
        if(data.call.name == 'actionAdd'){
            requestSubscription(data);
        }
        else{
            console.log(data.targets);
            data.status = "received";
            data.response.writeHead(200, {'content-type': 'text/json' });
            data.response.end(JSON.stringify(data.targets));
        }
    }
    catch(ex){
        console.log(ex);
        data.response.writeHead(500, {'content-type': 'text/plain' });
        data.response.write('error' + ex);
        data.response.end();
    }
    finally{
        for(key in requestQueue){
            if(requestQueue[key].status == "requested" && requestQueue[key].requestId == data.requestId){
                requestQueue.splice(key, 1);
                break;
            }
        }
    }
}
