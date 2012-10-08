/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 5/10/12
 * Time: 3:46 PM
 * To change this template use File | Settings | File Templates.
 */

var mongodb = require("mongodb");

exports.connect = function (){

    console.log("Opening Mongo DB: flow...");

    var port = 27017;
    var serverOptions = {
        'auto_reconnect': true,
        'poolSize': 5
    };
    var dbServer = new mongodb.Server('localhost', port, {}); //serverOptions={}..
    var dbHandle = new mongodb.Db('flow', dbServer);
    dbHandle.open(function(err, db){
        if(err){
            throw err;
        } else {
            console.log("Mongo DB open.");
        }
    });

    return dbHandle;
}

/*
module.exports = mymongo = {
}
module.exports = function(){
}
*/