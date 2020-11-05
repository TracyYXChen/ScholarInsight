debugger;

window.addEventListener("load", doInject, false);

//var port = chrome.runtime.connect();
/*
window.addEventListener("message", function (event) {
    console.log("got message in content-script");
    if (event.source == window) {
        if (event.data.type && (event.data.type == "FROM_PAGE_TO_CONTENT_SCRIPT")) {
            // send to extension/background
            chrome.runtime.sendMessage(event.data);
            console.log("sent message from content-script");
            console.log(event.data);
        }
    }
})
*/

//pass the msg to background.js
window.addEventListener("message", function (event) {
    window.port = chrome.runtime.connect({name: "content-script"});
    console.log(event);
    window.port.postMessage({
        name: 'citation data',
        //tabId: chrome.devtools.inspectedWindow.tabId,
        message: event.data,
        source: 'content-script.js'
    });
})

/*
(function createConnection() {
    // Create a connection to the background page
    window.port = chrome.runtime.connect({name: "content-script"});

    // Initial message on connecting
    window.port.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId,
        source: 'content-script.js'
    });
    console.log('outside listener');


    
})();
*/


// Listen for messages from background.js
//chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // console.log("received message in content-script to update selection type to " + message.message);
        //console.log("sent message to activate-hover injected");
//        window.postMessage(message);
//    });


function doInject() {
    //var jsInitChecktimer = setInterval(updateScholarPage, 111);
    updateScholarPage();
    function updateScholarPage() {
        console.log("In content script, waiting to load...");
        var gsLoaded = checkForScholarPage();
        if (gsLoaded) {
            console.log("This is a Google Scholar Profile Page");
            var panelElement;
            panelElement = document.createElement('script');
            panelElement.type = 'text/javascript';
            panelElement.src = chrome.runtime.getURL('prepare-data-bundled.js');
            return document.body.appendChild(panelElement);
           
        }
        else {
            console.log("This is not a Google Scholar Profile Page");
        }
    }
}

function checkForScholarPage() {
    var foundElement = false;
    var curUrl = '';
    //check whether it's a google scholar file
    //can't use tab query except in background.js
    if (document.querySelector('link[rel="canonical"]') !== null) {
        curUrl = document.querySelector('link[rel="canonical"]').href;
        if (curUrl.startsWith('http://scholar.google.com/citations?user=')){
            foundElement = true;
        }
    }
    return foundElement;
}

