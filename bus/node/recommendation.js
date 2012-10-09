/**
 * Created with JetBrains WebStorm.
 * User: Anis
 * Date: 8/10/12
 * Time: 5:33 PM
 * To change this template use File | Settings | File Templates.
 */

var recommend = exports;

recommend.actionSelect = function(db, data, callback){
    db.collection("actionsRecommendation",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}

recommend.actionAdd = function(db, data, callback){
    db.collection("actionsRecommendation",  function(err, collection){
        collection.save(data.call.data,function(err, results){
            if(results) data.targets = results;
            callback(data);
        });
    });
}
