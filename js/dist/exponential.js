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
        .domain([0, 5])
        .range([0, width]);
 
var y = d3.scaleLinear()
        .domain([0, 5])
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
 
var lambda_init = 3;        // initial params for exponential

var params = [lambda_init]

initial_chart(params);

function generate_data(params){

    var lambda = params[0];

    var data = [];

    for (var x = 0; x < 5 + 0.05; x += 0.01) {     // make the line extend slightly beyond the x-axis
        var pdf = jStat.exponential.pdf(x, lambda);
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

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
     .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
 }

function chart(data){  

var line = d3.line()
    .x(function(d) { return x(d[0] * 0.01) })  // 0.01 is the delta corresponding to the for loop
    .y(function(d) { return y(d[1]) });

    svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", line);

}

d3.select("#lambda-slider").on("input", function() {
    params[0] = +this.value;
    update(params);
});

function update_controls(params) {

    var lambda = params[0];
    
    d3.select("#lambda-value").text(lambda.toFixed(1));
    d3.select("#lambda-slider").property("value", lambda);

}

function update(params) {
    
    d3.selectAll(".line").remove();  // clear chart
    
    update_controls(params);
    add_dist_line(params);
}