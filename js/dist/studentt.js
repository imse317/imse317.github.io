var margin = {top: 40, right: 40, bottom: 30, left: 70},
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
var x = d3.scaleLinear()
        .domain([-5, 5])
        .range([0, width]);
 
var y = d3.scaleLinear()
        .domain([0, 0.4])
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
 
var dof_init = 1;  // initial params for t dist

var params = [dof_init]

initial_chart(params);

chart_z();

function generate_data_z(){

    // standard normal dist
    var mu = 0;
    var sigma = 1;

    var data = [];

    for (var x = -5; x < 5 + 0.1; x += 0.01) {    // make the line extend slightly beyond the x-axis
        var pdf = jStat.normal.pdf(x, mu, sigma);
        data.push([x, pdf]);       
    }

    return data;
}

function chart_z(){  

    var line = d3.line()
    .x(function(d) { return x(d[0]) })
    .y(function(d) { return y(d[1]) });

    data = generate_data_z();

    path = svg.append('path')
            .attr("class", "line_z")
            .datum(data)
            .attr("d", line);

    path.on("mouseover", function() {
        d3.select(".line_z")
            .style("stroke", darkgreen)
            .style("stroke-width", 6);
        })
        .on("mouseout", function() {
        d3.select(".line_z")
            .style("stroke", "darkgreen")
            .style("stroke-width", 5);
        }); 
}

function generate_data(params){

    var dof = params[0];

    var data = [];

    for (var x = -5; x < 5 + 0.1; x += 0.01) {
        var pdf = jStat.studentt.pdf(x, dof);
        data.push([x, pdf]);         
    }
 
    return data;
}

function add_dist_line(params) {

    var line = d3.line()
    .x(function(d) { return x(d[0]) })
    .y(function(d) { return y(d[1]) });

    data = generate_data(params);

    path = svg.append('path')
            .attr("class", "line")
            .datum(data)
            .attr("d", line);
}

function initial_chart(params){

    update_controls(params);
    add_dist_line(params);

    // add transition
    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition;

        path.on("mouseover", function() {
            d3.select(".line")
                .style("stroke", darkred)
                .style("stroke-width", 6);
            })
          .on("mouseout", function() {
            d3.select(".line")
                .style("stroke", "red")
                .style("stroke-width", 5);
            }); 

}

var darkred = "#cc0000";
var darkgreen = "#006600";


function chart(data){  

    var line = d3.line()
            .x(function(d) { return x(d[0] * 0.01 - 5) })  // 0.1 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) });

        path = svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", line);

        path.on("mouseover", function() {
            d3.select(".line")
                .style("stroke", darkred)
                .style("stroke-width", 6);
            })
          .on("mouseout", function() {
            d3.select(".line")
                .style("stroke", "red")
                .style("stroke-width", 5);
            }); 

}

d3.select("#dof-slider").on("input", function() {
    params[0] = +this.value;
    update(params);
});

function update_controls(params) {

    var dof = params[0];
    
    d3.select("#dof-value").text(dof);
    d3.select("#dof-slider").property("value", dof);

}

function update(dof) {

    d3.selectAll(".line").remove();  // clear chart
    
    update_controls(params);
    add_dist_line(params);
}