/**
 * Created with JetBrains WebStorm.
 * User: Anis
 * Date: 8/10/12
 * Time: 5:39 PM
 * To change this template use File | Settings | File Templates.
 */

var geography = exports;

geography.facilitySelect = function(db, data, callback){
    db.collection("facilities",  function(err, collection){
        collection.find().toArray(function(err, results){
            data.targets = results;
            callback(data);
        });
    });
}
