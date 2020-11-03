// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.runtime.*

// Function called in devtools.js


var d3 = require('d3');
var $ = require('jquery');

console.log($('#gsc_a_ca'));
console.log("in panel.js");

function updatePanel(msg) {
    var message = msg.message;
    console.log("message in panel.js", message);
}


(function createConnection() {
    // Create a connection to the background page
    window.port = chrome.runtime.connect({name: "panel"});
    console.log("In creating connections");
    // Initial message on connecting
    window.port.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId,
        source: 'panel.js'
    });

    // Listen for messages from background, and update panel's info with message received
    window.port.onMessage.addListener(function (message) {
        console.log(message);
        //chrome.devtools.inspectedWindow.eval(`console.log("received message from ${message.source} in panel");`);
        //chrome.devtools.inspectedWindow.eval(`console.log(${JSON.stringify(message)});`);
        if (message.message) {
            updatePanel(message);
        }
    });
})();
