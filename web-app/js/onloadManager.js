window.ddbOnloadListenerQueue = new Array();

window.ddbAddOnloadListener = function(listener) {
    window.ddbOnloadListenerQueue.push(listener);
};

window.ddbNotifyOnloadListener = function() {
    for ( var i = 0; i < window.ddbOnloadListenerQueue.length; i++) {
        try {
            window.ddbOnloadListenerQueue[i]();
        } catch (error) {
            if (typeof console != "undefined") {
                console.log(error);
            }
        }
    }
};

$(document).ready(function() {
    window.ddbNotifyOnloadListener();
});
