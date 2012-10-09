/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 4/10/12
 * Time: 2:44 PM
 * To change this template use File | Settings | File Templates.
 */
var events = require('events');
var util = require('util');

// The Thing That Emits Event
Eventer = function(){
    events.EventEmitter.call(this);
    this.kapow = function(){
        var data = "BATMAN"
        this.emit('blamo', data);
    }

    this.bam = function(){
        this.emit("boom");
    }
};

util.inherits(Eventer, events.EventEmitter);

// The thing that listens to, and handles, those events
Listener = function(){
    this.blamoHandler =  function(data){
        console.log("** blamo event handled");
        console.log(data);
    },
        this.boomHandler = function(data){
            console.log("** boom event handled");
        }

};

// The thing that drives the two.
var eventer = new Eventer();
var listener = new Listener(eventer);
eventer.on('blamo', listener.blamoHandler);
eventer.on('boom', listener.boomHandler);

eventer.kapow();
eventer.bam();

//Adapter, Events etc.
//subscriptions to be considered as per events
subscriptions = {
    id: 1,
    name: 'actionAdd',
    subscriber: [ //module name
        {id:1, name:'dispatch'},
        {id:2, name:'recommendation'},
        {id:3, name:'callCenter'},
        {id:4, name:'contactCenter'}
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
