/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 4/10/12
 * Time: 2:17 PM
 * To change this template use File | Settings | File Templates.
 */

var messageapi = exports;

messageapi.performerSelect = function(db, data, callback){
    db.collection("performers",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

messageapi.facilitySelect = function(db, data, callback){
    db.collection("facilities",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

messageapi.actionClassSelect = function(db, data, callback){
    db.collection("actionClasses",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

messageapi.actionSelect = function(db, data, callback){
    db.collection("actions",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

messageapi.actionRecommendationSelect = function(db, data, callback){
    db.collection("actions",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

messageapi.actionAdd = function(db, data, callback){
    db.collection("actions",  function(err, collection){
        collection.save(data.call.data,function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

messageapi.actionAddRecommendation = function(db, data, callback){
    db.collection("actionsRecommendation",  function(err, collection){
        collection.save(data.call.data,function(err, results){
            if(results) data.targets = results;
            callback(data);
        });
    });
}
