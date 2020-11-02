debugger;

window.addEventListener("load", doInject, false);

var port = chrome.runtime.connect();

window.addEventListener("message", function (event) {
    if (event.source == window) {
        if (event.data.type && (event.data.type == "FROM_PAGE_TO_CONTENT_SCRIPT")) {
            // send to extension/background
            chrome.runtime.sendMessage(event.data);
            // console.log("sent message from content-script");
        }
    }
})

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === "updateSelectionType" || message.name === "updateHighlight") {
        // console.log("received message in content-script to update selection type to " + message.message);
        window.postMessage(message);
        // console.log("sent message to activate-hover injected");
    }
});

function doInject() {
    var jsInitChecktimer = setInterval(updateScholarPage, 111);

    function updateScholarPage() {
        console.log("In content script, waiting to load...");
        var gsLoaded = checkForScholarPage();
        //console.log(document.querySelector('link[rel="canonical"]'));
        if (gsLoaded) {
            clearInterval(jsInitChecktimer);
            console.log("This is a Google Scholar Profile Page");
            var scriptElement;
            scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.src = chrome.runtime.getURL('scatter-plot-bundled.js');
            return document.body.appendChild(scriptElement);
            //plot_scatter();
        }
        else {
            console.log("This is not a Google Scholar Profile Page");
        }
    }
}

function checkForScholarPage() {
    var foundElement = false;
    //check whether it's a google scholar file
    //can't use tab query except in background.js
    curUrl = document.querySelector('link[rel="canonical"]').href;
    console.log(curUrl);
    if (curUrl.startsWith('http://scholar.google.com/citations?user=')){
    //.startsWidh('https://scholar.google.com/citations?user='))
        foundElement = true;
    }
    return foundElement;
}

