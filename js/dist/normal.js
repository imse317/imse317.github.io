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

var mu_glob = 25, sigma_glob = 6;  // initial parameters

chart_init(update(mu_glob, sigma_glob))  // initial chart

function generate_data(mu, sigma){

    var n = [];

    for (var i = 0; i < 50; i += 0.1) {
        n.push(jStat.normal.pdf(i, mu, sigma));     
    }
 
    data = n.map(function(d, i) {
            return[i, d];
        });

    return data;
    
}

function chart_init(data){

    var line = d3.line()
            .x(function(d) { return x(d[0] * 0.1) })  // 0.1 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) });

        path = svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", line);

    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0) // Set final value of dash-offset for transition
        .on("end", function() {plot_mean(mu_glob, sigma_glob)});
}


function chart(data){  

    var line = d3.line()
            .x(function(d) { return x(d[0] * 0.1) })  // 0.1 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) });

    svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", line);

    plot_mean(mu_glob, sigma_glob);
}

function plot_mean(mu, sigma){

    var mean = mu;

    var height_mean = jStat.normal.pdf(mean, mu, sigma)

    svg.append("line")
    .attr("class", "mean")
    .attr("x1", x(mean))
    .attr("y1", y(height_mean))
    .attr("x2", x(mean))
    .attr("y2", height)
}

d3.select("#mu-slider").on("input", function() {
    chart(update(this.value, sigma_glob));
});

d3.select("#sigma-slider").on("input", function() {
    chart(update(mu_glob, this.value));
});

function update(mu, sigma) {

    var mu_display = +mu;
    var sigma_display = +sigma;
    
    d3.select("#mu-value").text(mu_display.toFixed(1));
    d3.select("#mu-slider").property("value", mu);

    d3.select("#sigma-value").text(sigma_display.toFixed(1));
    d3.select("#sigma-slider").property("value", sigma);
    
    mu_glob = mu;
    sigma_glob = sigma;

    d3.selectAll(".line, .mean").remove();  // clear chart
    
    data = generate_data(+mu, +sigma);

    return data;
}
