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
        .domain([-1, 0, 1, 2])
        .rangeRound([0, width], .1)
        .paddingInner(0.85);
 
var y = d3.scaleLinear()
        .domain([0, 1])
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

var p_init = 0.5;  // initial params for bernoulli

var params = [p_init]

initial_chart(params);

function generate_data(params){

    var p = params[0];

    var data = [];

    for (var x = 0; x < 2; x += 1) { 
        var pmf = bernoulli_pmf(x, p);
        data.push([x, pmf]);
    }

    return data;
}

var darkred = "#b30000";

function add_dist_bar(params){  

    var data = generate_data(params);

    bars = svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[0]) })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[1]) })
      .attr("height", function(d) { return height - y(d[1]) });

    mouseOver(); 
}

function initial_chart(params){

    add_dist_bar(params);

    // add transition
    bars.attr("y",  function(d) { return height; })
    .attr("height", 0)
        .transition()
        .duration(700)
        .delay(function (d, i) {
            return i * 200;
        })
    .attr("y", function(d) { return y(d[1]) })
    .attr("height", function(d) { return height - y(d[1]) })
    .on("end", function() {add_data_label(params)});

    mouseOver();

    update_controls(params);
}

function add_data_label(params){

    var data = generate_data(params);

    svg.selectAll("text.bar")
      .data(data)
    .enter().append("text")
        .attr("class", "bar-value")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(d[0]) + x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1])-8; })
        .text(function(d) { var d_display = +d[1]; return d_display.toFixed(2); });
}

function mouseOver(){

    bars.on("mouseover", function() {
        d3.select(this)
            .style("fill", darkred);
        })
      .on("mouseout", function() {
        d3.select(this)
            .style("fill", "red");
        }); 
}

d3.select("#p-slider").on("input", function() {
    params[0] = +this.value;
    update(params);
});

function update_controls(params) {

    var p = params[0];
    
    d3.select("#p-value").text(p.toFixed(2));   // set it to always display 2 decimal places
    d3.select("#p-slider").property("value", p);

}

function update(params) {

    d3.selectAll(".bar, .bar-value").remove();  // clear chart
    
    update_controls(params);
    add_dist_bar(params);
    add_data_label(params); 
}

function bernoulli_pmf(x, p){
    var pmf;
    if(x == 1) { pmf = p } else if(x == 0) { pmf = 1-p } else { pmf = 0 }
    return pmf;
}