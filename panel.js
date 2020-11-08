// Function called in devtools.js
var d3 = require('d3');
var $ = require('jquery');
var d3Tip = require('d3-tip');

//receive data
(function createConnection() {
     // Create a connection to the background page
     window.port = chrome.runtime.connect({name: "panel"});
 
     // Initial message on connecting
     window.port.postMessage({
         name: 'init',
         tabId: chrome.devtools.inspectedWindow.tabId,
         source: 'panel.js'
     });
 
     // Listen for messages from background, and update panel's info with message received
     window.port.onMessage.addListener(function (message) {
         //chrome.devtools.inspectedWindow.eval(`console.log("received message from ${message.source} in panel");`);
         //chrome.devtools.inspectedWindow.eval(`console.log(${JSON.stringify(message.message.message.citationData)});`);
         if (message.message) {
             updatePanel(message);
         }
     });
 })();

function updatePanel(message) {
     data = JSON.parse(message.message.message.citationData);
     scatterPlot(data);
}

function scatterPlot(data) {
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
     chrome.devtools.inspectedWindow.eval(`console.log(in scatter plot, the data is);`);
     chrome.devtools.inspectedWindow.eval(`console.log(${JSON.stringify(data)})`);

     //get median citation for each year
     var medCit = d3.nest()
          .key(function(d) { return d.year; })
          .sortKeys(d3.ascending)
          .rollup(function(d) {
               return {
                    medCitation: d3.median(d, function(g) { return +g['citation']; })
               };
          })
          .map(data);
     //chrome.devtools.inspectedWindow.eval(`console.log(med citation is);`);
     //chrome.devtools.inspectedWindow.eval(`console.log(${JSON.stringify(medCit)});`);

     var margin = {
     top: 20,
     right: 100,
     bottom: 80,
     left: 80
     }
     width = 600 - margin.left - margin.right;
     height = 400 - margin.top - margin.bottom;

     

     var x = d3.scaleLinear().range([0, width]);
     var y = d3.scaleLinear().range([height, 0]);
     // Scale the range of the data
     x.domain(d3.extent(data, function (d) {
     return d.year;
     }));
     y.domain([0, d3.max(data, function (d) {
     return d.citation;
     })]);

     

     var svg = d3.select("#main-vis").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     var dot = svg.selectAll("dot")
     .data(data)
     .enter().append("circle")
     .attr("r", 2)
     .attr("cx", function (d) {
          return x(d.year);
     })
     .attr("cy", function (d) {
          return y(d.citation);
     })
     //change color based on relative position compared with median citations
     .style('fill', function(d) {
          if (d.firstAuthor === True) {
               return 'blue'
          }
          else if (d.lastAuthor === True) {
               return 'orange'
          }
          else {
               return 'black'
          }
     })

     //median citation line
     svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .style("stroke-dasharray", ("3, 3"))
          .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(medCit['$'+d.year]['medCitation']) })
            );
     //add legend
     svg.append("line")
          .attr("x1", 405)
          .attr("x2", 433)
          .attr("y1", 10)
          .attr("y2", 10)
          .style("stroke-dasharray","3,3")
          .style("stroke", "steelblue");

     svg.append("text")
          .attr("x", 435)
          .attr("y", 12)
          .text("Median Citation")
          .style("font-size", "12px")
          .attr("alignment-baseline","right")



     xAxisTicks = x.ticks()
     .filter(tick => Number.isInteger(tick));

     yAxisTicks = y.ticks()
     .filter(tick => Number.isInteger(tick));

     svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).tickValues(xAxisTicks).tickFormat(d3.format('d')));
     //x label
     svg.append('text')
     .attr('class', 'label')
     .attr('transform','translate(250, 360)')
     .text('Published Year');

     svg.append("g")
     .call(d3.axisLeft(y).tickValues(yAxisTicks).tickFormat(d3.format('d')));
     //y label
     svg.append('text')
     .attr('class', 'label')
     .attr('transform','translate(-40,200) rotate(270)')
     .text('Citations (so far)');


     //add tooltips
     var toolTip = d3Tip()
          .attr("class", "d3-tip")
          .html(function(d) {
               return "<div style='width:150px;color: #1A0DAB; font-family: Arial, Helvetica, sans-serif; font-size:14px'>"+d['title']+"</div>"+
                    "<div style='width:150px;color: #777777'; font-family: Arial, Helvetica, sans-serif'; font-size:12px>"+d['author']+"</div>"+
                    "<div style='width:150px;color: #777777'; font-family: Arial, Helvetica, sans-serif'; font-size:12px>"+d['journal']+"</div>"+
                    "<div style='color: #222222'; font-family: Arial, Helvetica, sans-serif'; font-size:14px>Citation: "+d['citation']+"  Year: "+d['year']+"</div>"
     });

     svg.call(toolTip);
     dot.on('mouseover', toolTip.show)
          .on('mouseout', toolTip.hide);

}