/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 4/10/12
 * Time: 2:44 PM
 * To change this template use File | Settings | File Templates.
 */
var events = require("events");
var eventEmitter = new events.EventEmitter();

module.exports = myevents = {

    actionAdd: function(data){
        console.log('actionAdd: triggered actionAdded event.');
    },

    init: function(){
        console.log('init event.');

        eventEmitter.on("actionAdd", function(data){
            console.log('actionAdd2: triggered actionAdded event.');

        });

        eventEmitter.emit("actionAdd", "New Action:T1008 added.");
    }
}


//Adapter, Events etc.
//subscriptions to be considered as per events
subscriptions = {
    id: 1,
    name: 'actionAdd',
    subscriber: [
        {id:1, name:'dispatch'},
        {id:2, name:'recommendation'}
    ]
};

subscriptions = {
    id: 2,
    name: 'actionUpdate',
    subscriber: [
        {id:1, name:'dispatch'},
        {id:2, name:'recommendation'}
    ]
};
