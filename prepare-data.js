var $ = require('jquery');
data = []
$('tr.gsc_a_tr').each(function (i, el) {
    tmp = {};
    var $tds = $(this).find('td');
    tmp['title'] = $tds.eq(0).text();
    tmp['citation'] = $tds.eq(1).text();
    tmp['year'] = $tds.eq(2).text();
    data.push(tmp)
});

var packData = {citationData: JSON.stringify(data)};
//do I really need to stringify

window.postMessage({
    type: "FROM_PAGE_TO_CONTENT_SCRIPT",
    message: packData,
}, "*");