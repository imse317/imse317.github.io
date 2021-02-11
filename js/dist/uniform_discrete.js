var margin = {top: 40, right: 40, bottom: 30, left: 70},
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
var x = d3.scaleBand()
        .domain(d3.range(11))
        .rangeRound([0, width], .1)
        .paddingInner(0.8);
 
var y = d3.scaleLinear()
        .domain([0, 0.5])
        .range([height, 0]);

var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);
  
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y-axis")    
    .call(yAxis);


var dist_name = "uniform_discrete";

var params = [a=1, b=6];   // set initial params

var start = 0, stop = 11, step = 1;

initial_chart_bars(dist_name, params);

update_chart_bars(dist_name, params);
