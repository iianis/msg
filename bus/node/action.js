/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 4/10/12
 * Time: 2:17 PM
 * To change this template use File | Settings | File Templates.
 */

var action = exports;

action.actionSelect = function(db, data, callback){
    db.collection("actions",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

action.actionAdd = function(db, data, callback){
    db.collection("actions",  function(err, collection){
        collection.save(data.call.data,function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

action.performerSelect = function(db, data, callback){
    db.collection("performers",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

action.actionClassSelect = function(db, data, callback){
    db.collection("actionClasses",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}
