window.addEventListener("load", doInject, false);

var port = chrome.runtime.connect();

window.addEventListener("message", function (event) {
    console.log("got message in content-script");
    if (event.source == window) {
        if (event.data.type && (event.data.type == "FROM_PAGE_TO_CONTENT_SCRIPT")) {
            // send to extension/background
            chrome.runtime.sendMessage(event.data);
            // console.log("sent message from content-script");
        }
    }
})


function doInject() {
    var jsInitChecktimer = setInterval(updateScholarPage, 111);

    function updateScholarPage() {
        console.log("In content script, waiting to load...")
        var gsLoaded = checkForScholarPage();
        if (gsLoaded) {
            console.log("Scholar pages found!");
            // console.log("SVG Graphic Element found!")
            clearInterval(jsInitChecktimer);
            var scriptElement;
            scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.src = chrome.runtime.getURL('scatter-plot.js');
            return document.body.appendChild(scriptElement);
        }
    }
}

function checkForScholarPage() {
    var foundElement = true;
    //check whether it's a google scholar file
    return foundElement;
}