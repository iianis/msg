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
///mongoDb
var mongodb = require("mongodb");
var serverOptions = {
    'auto_reconnect': true,
    'poolSize': 5
};
var dbServer = new mongodb.Server('localhost', 27017, {}); //serverOptions={}..
console.log("Opening Mongo DB: flow...");
var dbHandle = new mongodb.Db('flow', dbServer);
//mongoDb end

var requestQueue = [];
var targets = [];

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

    request.addListener('data', function(chunk) {
        data += chunk;
    });
    request.addListener('end', function() {
        try{
            var jData = JSON.parse(data);
            requestQueue[jData.request] = jData;
            console.log(requestQueue[jData.request].call.name);
            targets = requestProcess(requestQueue[jData.request], request, response);
            //response.writeHead(200, {'content-type': 'text/json' });
            //response.end(JSON.stringify(targets));
        }
        catch(ex){
            response.writeHead(500, {'content-type': 'text/plain' });
            response.write('error' + ex);
            response.end();
        }
    });
}

console.log("Web server is ready for your requests @ http://localhost:1337\n");

function requestProcess(data, request, response){

    var collection = '';

    switch(data.call.name){
        case 'performerSelect':
            collection = 'performers';
            break;
        case 'facilitySelect':
            collection = 'facilities';
            break;
        case 'actionClassSelect':
            collection = 'actionClasses';
            break;
        default :
            break;
    }

    dbHandle.open(function(err, db){

        var performerSelect = function(err, collection){
            collection.find().toArray(function(err, results){
                //console.log('send back call');
                callback(results);
            });
        }

        if(err){
            throw err;
        } else {
            console.log("Mongo DB open.");
            dbHandle.collection(collection, performerSelect);
            console.log('done');
        }
    });

    function callback(results){
        try{
            targets = results;

            response.writeHead(200, {'content-type': 'text/json' });
            response.end(JSON.stringify(targets));
        }
        catch(ex){
            response.writeHead(500, {'content-type': 'text/plain' });
            response.write('error' + ex);
            response.end();
        }
    }
}