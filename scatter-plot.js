var d3 = require('d3');

window.addEventListener('message', (message) => {
	// console.log("received message in injected script");
  console.log("in scatter plot", message);  
});

data = [{
  date: 2009,
  wage: 7.25
}, {
  date: 2008,
  wage: 6.55
}, {
  date: 2007,
  wage: 5.85
}, {
  date: 1997,
  wage: 5.15
}, {
  date: 1996,
  wage: 4.75
}, {
  date: 1991,
  wage: 4.25
}, {
  date: 1981,
  wage: 3.35
}, {
  date: 1980,
  wage: 3.10
}, {
  date: 1979,
  wage: 2.90
}, {
  date: 1978,
  wage: 2.65
}]

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
  parseDate = d3.timeParse("%Y");
  d.date = parseDate(d.date);
  d.wage = +d.wage;
});
//sort the data by date
data.sort(function (a, b) {
  return a.date - b.date;
});

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// Scale the range of the data
x.domain(d3.extent(data, function (d) {
     return d.date;
}));
y.domain([0, d3.max(data, function (d) {
     return d.wage;
})]);

var valueline = d3.line()
     .x(function (d) {
          return x(d.date);
     })
     .y(function (d) {
          return y(d.wage);
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
           return x(d.date);
     })
     .attr("cy", function (d) {
          return y(d.wage);
     })

svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));
svg.append("g")
     .call(d3.axisLeft(y).tickFormat(function (d) {
          return "$" + d3.format(".2f")(d)
     }));