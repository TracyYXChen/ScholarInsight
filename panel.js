// Function called in devtools.js
var d3 = require('d3');
var $ = require('jquery');


//extract table
data = []
$('tr.gsc_a_tr').each(function (i, el) {
tmp = {};
var $tds = $(this).find('td');
tmp['title'] = $tds.eq(0).text();
tmp['citation'] = $tds.eq(1).text();
tmp['year'] = $tds.eq(2).text();
data.push(tmp)
});
console.log(data);



var margin = {
top: 20,
right: 20,
bottom: 30,
left: 40
}
width = 700 - margin.left - margin.right;
height = 500 - margin.top - margin.bottom;

// format the data
data.forEach(function (d) {
//parseDate = d3.timeParse("%Y");
d.year = +d.year;
d.citation = +d.citation;
});
//sort the data by year
data.sort(function (a, b) {
return a.year - b.year;
});

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// Scale the range of the data
x.domain(d3.extent(data, function (d) {
     return d.year;
}));
y.domain([0, d3.max(data, function (d) {
     return d.citation;
})]);

var valueline = d3.line()
     .x(function (d) {
          return x(d.year);
     })
     .y(function (d) {
          return y(d.citation);
     });

var svg = d3.select("#main-vis").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dot = svg.selectAll("dot")
     .data(data)
     .enter().append("circle")
     .attr("r", 5)
     .attr("cx", function (d) {
          return x(d.year);
     })
     .attr("cy", function (d) {
          return y(d.citation);
     })

svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));
svg.append("g")
     .call(d3.axisLeft(y).tickFormat(function (d) {
          return d
     }));
