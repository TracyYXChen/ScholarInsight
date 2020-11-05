// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
// 
// Can use:
// chrome.tabs.*
// chrome.runtime.*


var relayMsg = {};
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message, sender, sendResponse) {
       if (message.source === "content-script.js") { 
            message.source = 'background.js';
        }
        relayMsg = message; 
    });
});

//post to devtools.js
console.log(relayMsg);
chrome.runtime.onConnect.addListener(function(port) {
    port.postMessage(relayMsg);
});




//pass the msg to devltools.js
/*
window.addEventListener("message", function (event) {
    window.port = chrome.runtime.connect({name: "background"});
    console.log(event);
    window.port.postMessage({
        name: 'citation data',
        //tabId: chrome.devtools.inspectedWindow.tabId,
        message: event.data,
        source: 'background.js'
    });
})
*/