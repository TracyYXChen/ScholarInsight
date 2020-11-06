//const { data } = require('jquery');
//const { data } = require('jquery');
//var data = []
var $ = require('jquery')
//load 'show more'
var loadTimes = 0;
var intervalID = setInterval(function () {
    document.getElementById("gsc_bpf_more").click();
    data = [];
    $('tr.gsc_a_tr').each(function (i, el) {
        tmp = {};
        var $tds = $(this).find('td');
        tmp['title'] = $tds.eq(0).text();
        rawCit = $tds.eq(1).text();
        //process citation
        if (rawCit === '') {
            rawCit = '0'
        }
        var numCit = rawCit.match(/\d/g);
        numCit = numCit.join("");
        tmp['citation'] = numCit;
        tmp['year'] = $tds.eq(2).text();
        //only record publications with years
        if (tmp['year'] !== '') {
            data.push(tmp)
        }
});
   // load at most 50 times, which is about 5k papers
   if (++loadTimes === 50) {
        window.clearInterval(intervalID);
       //send to content-script
        packData = {citationData: JSON.stringify(data)};
        window.postMessage({
            type: "FROM_PAGE_TO_CONTENT_SCRIPT",
            message: packData,
}, "*");    
   }
}, 1);