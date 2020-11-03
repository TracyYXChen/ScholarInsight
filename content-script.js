debugger;

window.addEventListener("load", doInject, false);

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
            panelElement.src = chrome.runtime.getURL('panel-bundled.js');
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

