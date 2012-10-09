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
var mongoHandle = require("./node/mongo").connect();
var action = require("./node/action");
var recommendation = require("./node/recommendation");
var geography = require("./node/geography");

var events = require("events");
var eventEmitter = new events.EventEmitter();
eventEmitter.on("actionAdd", actionAdded);

var requestQueue = [];
var responseQueue = [];
var appTimer = (new Date()).getTime();

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
    if(filePath == './')
        filePath = "./browser/markup.html";
    else
        filePath = filePath.replace('./', './browser/');

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
            requestQueue[jData.requestId].receivedAt = appTimer;
        }
        catch(ex){
            response.writeHead(500, {'content-type': 'text/plain' });
            response.write('error: ' + ex);
            response.end();
        }
    }); //addListener
}

var reqInterval = setInterval(function(){requestProcess();}, 100);
var resInterval = setInterval(function(){responseProcess();}, 100);
var appInterval = setInterval(function(){
    appTimer++;
    //console.log(appTimer);
    var data = null;
    try{
        for(var key in requestQueue){
            //console.log('in' + appTimer);
            data = responseQueue[key];
            if(requestQueue[key].status == "requested" && (appTimer - requestQueue[key].receivedAt) > 5){
                console.log('request#' + requestQueue[key].requestId + ' timed-out, hence cleared from Queue.');
                data.response.writeHead(401, {'content-type': 'text/plain'});
                data.response.end('request timed-out.');
                requestQueue.splice(key, 1);
                responseQueue.splice(key, 1);
                break;
            }
        }
    }catch(e){
        if(data){
            data.response.writeHead(500, {'content-type': 'text/plain'});
            data.response.write('error' + e);
            data.response.end();
        }
    }
}, 1000);

function requestProcess(){
    for(var key in requestQueue){
        if(requestQueue[key].status == "requesting"){
            requestQueue[key].status = "requested";
            console.log('request#' + requestQueue[key].requestId + '  requested.');
            requestForward(requestQueue[key]);
            break;
        }
    }
}

function requestForward(data){
    var service = eval(data.call.name);
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
    //Events...which all systems or sub-systems need this information or already subscribed for..
    if(data.call.name == 'action.actionAdd'){
        eventEmitter.emit('actionAdd', data);
        //eventEmitter.emit('actionAdd', data.requestId, data.call, data.call.data);
    }
    responseQueue[data.requestId] = data;
    responseQueue[data.requestId].status = "received";
}

function responseProcess(){

    var data = null;

    try{
        for(var key in responseQueue){
            data = responseQueue[key];
            if(data.status == "received"){
                console.log('request#' + data.requestId + ', response received.');
                data.response.writeHead(200, {'content-type': 'text/json' });
                data.response.end(JSON.stringify(data.targets));
                break;
            }
            data = null;
        }
    }catch(e){
        if(data){
            data.response.writeHead(500, {'content-type': 'text/plain' });
            data.response.write('error' + e);
            data.response.end();
        }
    }finally{
        for(var key in responseQueue){
            if(responseQueue[key].status == "received"){
                console.log('request#' + responseQueue[key].requestId + ' Queue cleared.');
                requestQueue.splice(key, 1);
                responseQueue.splice(key, 1);
                break;
            }
        }
    }
}

//subscriptions to be considered as per events
var subscriptions = [
    {
        id: 1,
        name: 'actionAdd',
        subscriber: [ //module name
            {id:1, name:'recommendation'}
        ]
    },
    {
        id: 2,
        name: 'geographyAdd',
        subscriber: [ //module name
            {id:1, name:'callCenter'},
            {id:2, name:'contactCenter'}
        ]
    }
];

function actionAdded(data){
//function actionAdded(id, methodName, data){
    console.log('actionAdd: triggered an event.');
    var eventName = data.call.name.split('.');

    for(var index in subscriptions){
        var subscription = subscriptions[index];
        if(subscription.name == eventName[1]){
            for(var indexsubscriber in subscription.subscriber){
                var subscriber = subscription.subscriber[indexsubscriber];
                data.call.name = subscriber.name + '.' + eventName[1];
                console.log('request#' + data.requestId + ' subscription ' + subscriber.name + '.' + eventName[1] + ' in process..');
                var service = eval(data.call.name);
                if(service){
                    service(mongoHandle, data, function(){
                        callback4subscription(data);
                    });
                }else{
                    state.error('Unable to determine a call handler for "' + data.call.name + '".');
                    callback4subscription(data);
                }
            }
        }
    }
}

function callback4subscription(data){
    //Events...which all systems or sub-systems need this information or already subscribed for..
    console.log('request#' + data.requestId + ' subscription ' + data.call.name + ' executed.');
}
