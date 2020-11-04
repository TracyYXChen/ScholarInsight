// Function called in devtools.js
var d3 = require('d3');
var $ = require('jquery');


//extract table
/*
data = []
$('tr.gsc_a_tr').each(function (i, el) {
tmp = {};
var $tds = $(this).find('td');
tmp['title'] = $tds.eq(0).text();
tmp['citation'] = $tds.eq(1).text();
tmp['year'] = $tds.eq(2).text();
data.push(tmp)
});
console.log("in the panel.js")
console.log(data);
console.log(Date.now());
*/
data = [{citation:91, year:2007}, 
     {citation:473, year:2008}, 
     {citation:207, year:2008},
     {citation:180, year:2008}, 
     {citation:117, year:2008}, 
     {citation:93, year:2008},
     {citation:402, year:2009}, 
     {citation:255, year:2010}, 
     {citation:174, year:2010},
     {citation:110, year:2010}, 
     {citation:240, year:2011}, 
     {citation:219, year:2011},
     {citation:106, year:2011}, 
     {citation:72, year:2011},
     {citation:172, year:2012},
     {citation:69, year:2012}, 
     {citation:70, year:2013},
     {citation:103, year:2014}, 
     {citation:88, year:2014}
]
/*
data = [{
          citation: 91, 
          year: 2007
     }, {
          citation: 473, 
          year: 2008
     }, {
          citation: 207, 
          year: 2008
     }, {
          citation: 180, 
          year: 2008
     }, {
          citation: 117, 
          year: 2008
     }, {
          citation: 473, 
          year: 2008
     }, {
          citation: 93, 
          year: 2008
     }, {
          citation: 402, 
          year: 2009
     }, {
          citation: 255, 
          year: 2010
     }, {
          citation: 174, 
          year: 2010
     }, {
          citation: 110, 
          year: 2010
     }, {
          citation: 240, 
          year: 2011
     }, {
          citation: 219, 
          year: 2011
     }, {
          citation: 106, 
          year: 2011
     }, {
          citation: 72, 
          year: 2011
     }, {
          citation: 172, 
          year: 2012
     }, {
          citation: 69, 
          year: 2012
     }, {
          citation: 70, 
          year: 2013
     }, {
          citation: 103, 
          year: 2014
     }, {
          citation: 88, 
          year: 2014
     }
];
*/

//get median citation for each year
var medCit = d3.nest()
  .key(function(d) { return d.year; })
  .sortKeys(d3.ascending)
  .rollup(function(d) {
    return {
      medCitation: d3.median(d, function(g) { return g['citation']; })
    };
  })
  .map(data);


var margin = {
top: 20,
right: 20,
bottom: 80,
left: 80
}
width = 600 - margin.left - margin.right;
height = 400 - margin.top - margin.bottom;

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

var x = d3.scaleLinear().range([0, width]);
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
     //change color based on relative position compared with median citations
     .style('fill', function(d) {
          if (d.citation > medCit['$'+d.year]['medCitation']) {
               return 'blue'
          }
          else {
               return 'orange'
          }
     })

xAxisTicks = x.ticks()
     .filter(tick => Number.isInteger(tick));

svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).tickValues(xAxisTicks)
     .tickFormat(d3.format('d')));
//x label
svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(250, 360)')
    .text('Published Year');

svg.append("g")
     .call(d3.axisLeft(y).tickFormat(d => d));
//y label
svg.append('text')
     .attr('class', 'label')
     .attr('transform','translate(-40,200) rotate(270)')
     .text('Citations (so far)');
