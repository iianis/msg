/**
 * Created with JetBrains WebStorm.
 * User: Sahil
 * Date: 29/9/12
 * Time: 12:26 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    $(":button").bind('click', clickHandler);
});

var requestNumber = 1;
var requestQueue = [];

function clickHandler(event){
    $("#" + event.target.id + "Action").attr("class","requesting");
    $("#" + event.target.id + "Action").html("Requesting..");
    if(event.target.id != 'actionAdd') $("#" + event.target.id + "Rows").html("");

    requestHandler(event.target.id);
}

function requestHandler(requestId){
    //alert('requestHandler');
    var requestData = {
        id: 999,
        name: 'test'
    };

    $("#" + requestId + "Action").attr("class","waiting");
    $("#" + requestId + "Action").html("Waiting for response..");

    //requestId = (requestId.indexOf('Recommendation') > 0 ? requestId.replace('Recommendation','') : requestId);

    var callBackMethod = null;
    var callMethod = requestId + 'Select';
    var callModule = '';

    switch(requestId){
        case 'performer':
            callBackMethod = performerCallback;
            callModule = 'action';
            break;
        case 'facility':
            callBackMethod = facilityCallback;
            callModule = 'geography';
            break;
        case 'actionClass':
            callBackMethod = actionClassCallback;
            callModule = 'action';
            break;
        case 'action':
            callBackMethod = actionCallback;
            callModule = 'action';
            break;
        case 'actionRecommendation':
            callBackMethod = actionRecommendationCallback;
            callMethod = 'actionSelect';
            callModule = 'recommendation';
            break;
        case 'actionAdd':
            callBackMethod = actionAddCallback;
            callModule = 'action';
            callMethod = 'actionAdd';
            requestData = {
                id: $("#actionId").val(),
                name: $("#actionName").val()
            }
            break;
        default :
            break;
    }

    //uniqueRequestNumber = browserIP + '-' + requestNumber;
    var request = {
        'authorization': {'role': '000000000000000000000001'},
        'call': {'id': requestNumber, 'name': callModule + '.' + callMethod, 'data': requestData, 'callBack': callBackMethod},
        'requestId': requestNumber,
        'status': 'requesting',
        'target': 'iiCall'
    };

    requestQueue[requestNumber] = request;
    requestNumber++;

    $.ajax('/messagebus/provider.aspx', {
        type: 'POST',
        data: JSON.stringify(request),
        contentType: 'text/json',
        success: callBackMethod,
        //success: function(data) { if ( callback ) callback(data); },
        error  : function(data) { if ( callBackMethod ) callBackMethod(false); }
    });
}

function performerCallback(data){
    //alert(data);
    $('#performerRows').html('');

    if(data == "requested.") return;

    if(data.length > 0) {
        for(var key in data) {
            var dataRow = generateTableRow(data[key]);
            $('#performerRows').append($(dataRow));
        }
    } else {
        var dataRow = generateTableRow(null);
        $('#performerRows').append($(dataRow));
    }

    $("#performerRows tr:even").addClass("tableRowEven");
    $("#performerRows tr:odd").addClass("tableRowOdd");

    $("#performerAction").attr("class","received");
    $("#performerAction").html("Received");

}

function facilityCallback(data){

    $('#facilityRows').html('');

    if(data.length > 0) {
        for(var key in data) {
            var dataRow = generateTableRow(data[key]);
            $('#facilityRows').append($(dataRow));
        }
    } else {
        var dataRow = generateTableRow(null);
        $('#facilityRows').append($(dataRow));
    }

    $("#facilityRows tr:even").addClass("tableRowEven");
    $("#facilityRows tr:odd").addClass("tableRowOdd");

    $("#facilityAction").attr("class","received");
    $("#facilityAction").html("Received");

}

function actionClassCallback(data){

    $('#actionClassRows').html('');

    if(data.length > 0) {
        for(var key in data) {
            var dataRow = generateTableRow(data[key]);
            $('#actionClassRows').append($(dataRow));
        }
    } else {
        var dataRow = generateTableRow(null);
        $('#actionClassRows').append($(dataRow));
    }

    $("#actionClassRows tr:even").addClass("tableRowEven");
    $("#actionClassRows tr:odd").addClass("tableRowOdd");

    $("#actionClassAction").attr("class","received");
    $("#actionClassAction").html("Received");
}

function actionAddCallback(data){

    $("#actionAddAction").attr("class","received");
    $("#actionAddAction").html("Received");
}

function actionCallback(data){
    //alert(data);
    $('#actionRows').html('');

    if(data == "requested.") return;

    if(data.length > 0) {
        for(var key in data) {
            var dataRow = generateTableRow(data[key]);
            $('#actionRows').append($(dataRow));
        }
    } else {
        var dataRow = generateTableRow(null);
        $('#actionRows').append($(dataRow));
    }

    $("#actionRows tr:even").addClass("tableRowEven");
    $("#actionRows tr:odd").addClass("tableRowOdd");

    $("#actionAction").attr("class","received");
    $("#actionAction").html("Received");

}

function actionRecommendationCallback(data){
    //alert(data);
    $('#actionRecommendationRows').html('');

    if(data == "requested.") return;

    if(data.length > 0) {
        for(var key in data) {
            var dataRow = generateTableRow(data[key]);
            $('#actionRecommendationRows').append($(dataRow));
        }
    } else {
        var dataRow = generateTableRow(null);
        $('#actionRecommendationRows').append($(dataRow));
    }

    $("#actionRecommendationRows tr:even").addClass("tableRowEven");
    $("#actionRecommendationRows tr:odd").addClass("tableRowOdd");

    $("#actionRecommendationAction").attr("class","received");
    $("#actionRecommendationAction").html("Received");

}/*
 * create a new table row
 */
function generateTableRow(item){
    if(!item){
        item = { id: 0, name: 'no returned data'}
    }

    var dataRow = " <tr id='" + item._id + "'>";
    dataRow += "<td>" + item.id + "</td>"
        + "<td>" + item.name + "</td>"
    dataRow += " </tr>";
    return dataRow;
}