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
        .domain([0, 50])
        .range([0, width]);
 
var y = d3.scaleLinear()
        .domain([0, 0.1])
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

var mu_init = 25, sigma_init = 6;  // initial params for normal

var params = [mu_init, sigma_init]

initial_chart(params);

function generate_data(params){

    var mu = params[0];
    var sigma = params[1];

    var data = [];

    for (var x = 0; x < 50 + 0.5; x += 0.1) {      // make the line extend slightly beyond the x-axis
        var pdf = jStat.normal.pdf(x, mu, sigma);
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
        .attr("stroke-dashoffset", 0) // Set final value of dash-offset for transition
        .on("end", function() {add_mean_line(params)});  // plot the mean after transition
}

function add_mean_line(params){

    var mu = params[0];
    var sigma = params[1];

    var mean = mu;
    var height_mean = jStat.normal.pdf(mean, mu, sigma);

    svg.append("line")
        .attr("class", "mean")
        .attr("x1", x(mean))
        .attr("y1", y(height_mean)+3)  // add a few pixels to avoid overlapping
        .attr("x2", x(mean))
        .attr("y2", height);
}

d3.select("#mu-slider").on("input", function() {
    params[0] = +this.value;
    update(params);
});

d3.select("#sigma-slider").on("input", function() {
    params[1] = +this.value;
    update(params);
});

function update_controls(params) {

    var mu = params[0];
    var sigma = params[1];
    
    d3.select("#mu-value").text(mu.toFixed(1));
    d3.select("#mu-slider").property("value", mu);

    d3.select("#sigma-value").text(sigma.toFixed(1));
    d3.select("#sigma-slider").property("value", sigma);

}

function update(params) {

    d3.selectAll(".line, .mean").remove();  // clear chart

    update_controls(params);
    add_dist_line(params);
    add_mean_line(params);
}