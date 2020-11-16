var d3 = require('d3');
var $ = require('jquery');
//var d3Tip = require('d3-tip');

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
     data.forEach(function (d) {
          //parseDate = d3.timeParse("%Y");
          d.year = +d.year;
          d.citation = +d.citation;
          });
          //sort the data by year
          data.sort(function (a, b) {
          return a.year - b.year;
        });
        
        
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
        //x.domain(d3.extent(data, function (d) {
        //return d.year;
        //}));
        x.domain([d3.min(data, function (d) {
          return d.year-1;
          }), d3.max(data, function (d) {
            return d.year+1;
            })]);
        
        
        y.domain([0, d3.max(data, function (d) {
        return d.citation*1.05;
        })]);
        
        
        xAxisTicks = x.ticks()
        .filter(tick => Number.isInteger(tick));
        
        yAxisTicks = y.ticks()
        .filter(tick => Number.isInteger(tick));
        
        var svg = d3.select("body").append("svg")
        .attr('id', 'main-vis')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(xAxisTicks).tickFormat(d3.format('d')));
        //x label
        svg.append('text')
        .attr('class', 'label')
        .attr('transform','translate(200, 340)')
        .text('Published Year');
        
        yAxis = svg.append("g")
        .call(d3.axisLeft(y).tickValues(yAxisTicks).tickFormat(d3.format('d')));
        //y label
        svg.append('text')
        .attr('class', 'label')
        .attr('transform','translate(-40,200) rotate(270)')
        .text('Citations (so far)');
        
        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        var square = svg
          .append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all");
        
        
        var clip = svg.append("defs").append("svg:clipPath")
              .attr("id", "clip")
              .append("svg:rect")
              .attr("width", width )
              .attr("height", height )
              .attr("x", 0)
              .attr("y", 0);
        
        
        
        var dot = svg.append('g')
              .attr("clip-path", "url(#clip)");
        
        //var toolTip = d3.tip()
        //      .attr("class", "d3-tip");
        var toolTip = d3.select('body').append('div')
            .attr('id', 'toolTip')
            .style('width', width)
            .style('height', height/5)
            .style('background-color', 'white')
            .style("opacity", 1);
        
        
        dot.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function (d) {
          return x(d.year);
        })
        .attr("cy", function (d) {
          
          return y(d.citation);
        })
        //change color based on relative position compared with median citations
        //.style('fill', "none")
        .style('fill', 'grey')
        .style('fill', function(d) {
          if (d.firstAuthor === true) {
               return 'orange'
          }
          else if (d.lastAuthor === true) {
               return 'steelblue'
          }
          else {
               return 'grey'
          }
        })
        .on('mouseover', d => {
          //console.log(d3.event.pageX, d3.event.pageY);
          //console.log(d['titleLink']);
          //console.log("<div style='width:400px;color: #1A0DAB; font-family: Arial, Helvetica, sans-serif; font-size:14px'><a href="+d['titleLink']+" target='_blank'>"+d['title']+"</a></div>");
          toolTip.transition()
          .duration(400)
          .style('opacity', 1);

          toolTip.style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY}px`)
          .html(
                "<div style='width:400px;color: #222222; font-family: Arial, Helvetica, sans-serif; font-size:14px'>"+d['title']+"</div>"+
                 "<div style='width:400px;color: #777777'; font-family: Arial, Helvetica, sans-serif'; font-size:12px>"+d['author']+"</div>"+
                 "<div style='width:400px;color: #777777'; font-family: Arial, Helvetica, sans-serif'; font-size:12px>"+d['journal']+"</div>"+
                 "<div style='color: #222222'; font-family: Arial, Helvetica, sans-serif'; font-size:14px>Citation: "+d['citation']+"  Year: "+d['year']+"</div>"
        );
        })
        .on('mouseout', () => {
          toolTip.transition()
            .duration(400)
            .style('opacity', 1);
        });
        
        
        var medline = svg.append('g')
              .attr("clip-path", "url(#clip)")
          
          //median citation line
        medline.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 1.5)
            .style("stroke-dasharray", ("3, 3"))
            .attr("d", d3.line()
              .x(function(d) { return x(d.year) })
              .y(function(d) { return y(medCit['$'+d.year]['medCitation']) })
              );
        
        
        //add legend for the line
        svg.append("line")
          .attr("x1", 405)
          .attr("x2", 433)
          .attr("y1", 10)
          .attr("y2", 10)
          .style("stroke-dasharray","3,3")
          .style("stroke", "grey");
        
        svg.append("text")
          .attr("x", 435)
          .attr("y", 12)
          .text("Median Citation by Year")
          .style("font-size", "12px")
          .attr("alignment-baseline","right")
        
        //add legend for dots
        svg.append("circle")
          .attr('r', 3)
          .attr('cx', 419)
          .attr('cy', 22)
          .style('fill', 'orange')
          
        svg.append('text')
          .attr("x", 435)
          .attr("y", 24)
          .text("First-author")
          .style("font-size", "12px")
          .attr("alignment-baseline","right")
        
        svg.append("circle")
          .attr('r', 3)
          .attr('cx', 419)
          .attr('cy', 34)
          .style('fill', 'steelblue')
          
        svg.append('text')
          .attr("x", 435)
          .attr("y", 36)
          .text("Last-author")
          .style("font-size", "12px")
          .attr("alignment-baseline","right")
        
        svg.append("circle")
          .attr('r', 3)
          .attr('cx', 419)
          .attr('cy', 46)
          .style('fill', 'grey')
          
        svg.append('text')
          .attr("x", 435)
          .attr("y", 48)
          .text("Others")
          .style("font-size", "12px")
          .attr("alignment-baseline","right")
        
        
        
        
        
        //add toolTips
        //var toolTip = d3Tip()
        //console.log(data[0]['title'])
        //var toolTip = d3.tip()
        //  .attr("class", "d3-tip");
        
        
        var zoom = d3.zoom()
          .scaleExtent([0.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
          .extent([[0, 0], [width, height]])
          .on("zoom", updateChart);
        
        square.call(zoom);
        
        
        //zoom(svg);
        
        // now the user can zoom and it will trigger the function called updateChart
        
        // A function that updates the chart when the user zoom and thus new boundaries are available
        function updateChart() {
        
        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);
        
        newxAxisTicks = newX.ticks()
        .filter(tick => Number.isInteger(tick));
        
        newyAxisTicks = newY.ticks()
        .filter(tick => Number.isInteger(tick));
        
        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX).tickValues(newxAxisTicks).tickFormat(d3.format('d')))
        yAxis.call(d3.axisLeft(newY).tickValues(newyAxisTicks).tickFormat(d3.format('d')))
        
        // update circle position
        dot
          .selectAll(".dot")
          .attr('cx', function(d) {return newX(d.year)})
          .attr('cy', function(d) {return newY(d.citation)});
        
        medline
          .selectAll("path")
          .attr("d", d3.line()
          .x(function(d) { return newX(d.year) })
          .y(function(d) { return newY(medCit['$'+d.year]['medCitation']) })
          );
        }
        
        $("#Reset").click(() => {
          //console.log('click');
          clip.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
        });

}