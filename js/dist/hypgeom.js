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
        .domain(d3.range(61))
        .rangeRound([0, width], .1)
        .paddingInner(0.4);
 
var y = d3.scaleLinear()
        .domain([0, 0.2])
        .range([height, 0]);

var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);
  
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis
        .tickValues(d3.range(0, 61, 5))
    );

svg.append("g")
    .attr("class", "y-axis")    
    .call(yAxis
        .tickValues(d3.range(0, 1, 0.05))
        .tickFormat(d3.format('.2f'))
    );


var dist_name = "hypgeom";

var params = [N=400, K=60, n=200];   // set initial params

initial_chart_bars(dist_name, params);

update_chart_bars(dist_name, params);
