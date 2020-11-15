//const { data } = require('jquery');
//const { data } = require('jquery');
//var data = []
var $ = require('jquery')
var authorName = ($('#gsc_prf_in')[0].innerText).split(' ');
var authorFirst = authorName[0];
var authorLast = authorName[authorName.length-1];
//load 'show more'
var loadTimes = 0;
var intervalID = setInterval(function () {
    document.getElementById("gsc_bpf_more").click();
    data = [];
    $('tr.gsc_a_tr').each(function (i, el) {
        tmp = {};
        var $tds = $(this).find('td');
        tmp['title']=$tds.eq(0).closest(".gsc_a_t").find(".gsc_a_at")[0].innerText;
        //the link couldn't be called due to security reasons
        //tmp['titleLink'] = $tds.eq(0).closest(".gsc_a_t").find(".gsc_a_at")[0].dataset['href'];
        //call google scholar
        //sepTitle = tmp["title"].replaceAll(' ', '+');
        //tmp['titleLink'] = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C21&q=" + sepTitle + "&btnG=";
        tmpComb = $tds.eq(0).closest(".gsc_a_t").find(".gs_gray"); 
        tmp['author']=tmpComb[0].textContent;
        tmp['firstAuthor'] = false;
        tmp['lastAuthor'] = false; 
        //get authorship
        if (tmp['author'].length !== 0) {
            authorArr = tmp['author'].split(', ');
            //only take one letter for first name
            //first and last names of the first author
            firstInit = authorArr[0].split(' ')[0][0];
            firstLast = authorArr[0].split(' ')[1];
            //first and last names of the last author
            lastInit = authorArr[authorArr.length-1].split(' ')[0][0];
            lastLast = authorArr[authorArr.length-1].split(' ')[1];
            //compare with the profile's name
            if (authorFirst.startsWith(firstInit) && authorLast===firstLast) {
                tmp['firstAuthor']=true;
            }
            if (authorLast.startsWith(lastInit) && authorLast===lastLast) {
                tmp['lastAuthor']=true;
            }
        }

        tmp['journal']=tmpComb[1].textContent;
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