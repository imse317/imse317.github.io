// This file contains common functions for making the d3 charts

// add the line for continuous distributions
function add_dist_line(dist_name, params, xrange, ref=false) {

    var line = d3.line()
    .x(function(d) { return x(d[0]) })
    .y(function(d) { return y(d[1]) });

    var data = generate_data(dist_name, params, xrange);

    if (ref == false) {
        path = svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", line);
    }
    else {
        path = svg.append('path')
        .attr("class", "line_reference")
        .datum(data)
        .attr("d", line);
    }
}


// add the bars for discrete distributions
function add_dist_bars(dist_name, params, xrange){  

    var data = generate_data(dist_name, params, xrange);

    bars = svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[0]) })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[1]) })
      .attr("height", function(d) { return height - y(d[1]) });

    mouseover_bars();
}


// for continuous distributions
function initial_chart_line(dist_name, params, xrange) {

    add_dist_line(dist_name, params, xrange);

    // add transition
    var totalLength = path.node().getTotalLength();

    if (dist_name != "normal") {
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
    }
    else {
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0) // Set final value of dash-offset for transition
          .on("end", function() {add_mean_line(dist_name, params)});
    }

    update_controls(dist_name, params);

}


// for discrete distributions
function initial_chart_bars(dist_name, params, xrange) {

    add_dist_bars(dist_name, params, xrange);

    // add transition
    if (dist_name != "bernoulli") {
        bars.attr("y",  function(d) { return height; })
            .attr("height", 0)
            .transition()
            .duration(700)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("y", function(d) { return y(d[1]) })
            .attr("height", function(d) { return height - y(d[1]) });
    }
    else {
        bars.attr("y",  function(d) { return height; })
            .attr("height", 0)
            .transition()
            .duration(700)
            .delay(function (d, i) {
                return i * 50;
            })
            .attr("y", function(d) { return y(d[1]) })
            .attr("height", function(d) { return height - y(d[1]) })
            .on("end", function() {add_bar_values(dist_name, params, xrange)});
    }

    update_controls(dist_name, params);
}

function add_bar_values(dist_name, params, xrange){

    var data = generate_data(dist_name, params, xrange);

    svg.selectAll("text.bar")
      .data(data)
    .enter().append("text")
        .attr("class", "bar-value")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(d[0]) + x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1])-8; })
        .text(function(d) { var d_display = +d[1]; return d_display.toFixed(2); });
}

var darkred = "#b30000";

function mouseover_bars(){

    bars.on("mouseover", function() {
        d3.select(this)
            .style("fill", darkred);
        })
      .on("mouseout", function() {
        d3.select(this)
            .style("fill", "red");
        }); 
}


function update_line(dist_name, params, xrange) {

    d3.selectAll(".line").remove();  // clear chart

    update_controls(dist_name, params);
    add_dist_line(dist_name, params, xrange);
}

function update_bars(dist_name, params, xrange) {
    
    d3.selectAll(".bar").remove();  // clear chart
    
    update_controls(dist_name, params);
    add_dist_bars(dist_name, params, xrange);
}


// update additional things that are specific to some distributions
function update_misc(dist_name, params, xrange) {

    switch (dist_name) {

        case "bernoulli":
            d3.selectAll(".bar-value").remove();
            add_bar_values(dist_name, params, xrange);
            break;

        case "normal": 
            d3.selectAll(".mean").remove();
            add_mean_line(dist_name, params);
            break;

    }

}


// update the controls (e.g., sliders)
function update_controls(dist_name, params) {

    d3.select("#slider_0").property("value", params[0]);
    d3.select("#slider_1").property("value", params[1]);
    d3.select("#slider_2").property("value", params[2]);

    // set how many decimal places to keep for display
    switch (dist_name) {

        case "bernoulli": 
            d3.select("#slider_value_0").text(params[0].toFixed(2));
            break;

        case "binomial": 
            d3.select("#slider_value_0").text(params[0]);
            d3.select("#slider_value_1").text(params[1].toFixed(2));
            break;

        case "geometric": 
            d3.select("#slider_value_0").text(params[0].toFixed(2));
            break;

        case "hypgeom": 
            d3.select("#slider_value_0").text(params[0]);
            d3.select("#slider_value_1").text(params[1]);
            d3.select("#slider_value_2").text(params[2]);
            break;

        case "poisson": 
            d3.select("#slider_value_0").text(params[0].toFixed(1));
            break;

        case "uniform_discrete": 
            d3.select("#slider_value_0").text(params[0]);
            d3.select("#slider_value_1").text(params[1]);
            break;

        case "chisquare": 
            d3.select("#slider_value_0").text(params[0]);
            break;

        case "exponential": 
            d3.select("#slider_value_0").text(params[0].toFixed(1));
            break;

        case "normal":
            d3.select("#slider_value_0").text(params[0].toFixed(1));
            d3.select("#slider_value_1").text(params[1].toFixed(1));
            break;

        case "studentt": 
            d3.select("#slider_value_0").text(params[0]);
            break;

        case "uniform":
            d3.select("#slider_value_0").text(params[0].toFixed(2));
            d3.select("#slider_value_1").text(params[1].toFixed(2));
            break;
    }
}

function add_mean_line(dist_name, params){

    switch (dist_name) {
        case "normal": 
            var mu = params[0];
            var sigma = params[1];        
            var mean = mu;
            var height_mean = jStat.normal.pdf(mean, mu, sigma);
            break;
        case "standard_normal": 
            var mu = 0;
            var sigma = 1;        
            var mean = mu;
            var height_mean = jStat.normal.pdf(mean, mu, sigma);
            break;
    }

    svg.append("line")
        .attr("class", "mean")
        .attr("x1", x(mean))
        .attr("y1", y(height_mean)+3)  // add a few pixels to avoid overlapping
        .attr("x2", x(mean))
        .attr("y2", height);
}


// call this function to make all the needed updates
function update_chart_line(dist_name, params, xrange) {

    d3.select("#slider_0").on("input", function() {

        params[0] = +this.value;
        update_line(dist_name, params, xrange);
        update_misc(dist_name, params, xrange);
    });
    
    d3.select("#slider_1").on("input", function() {

        params[1] = +this.value;        
        update_line(dist_name, params, xrange);
        update_misc(dist_name, params, xrange);
    });
}


// call this function to make all the needed updates
function update_chart_bars(dist_name, params, xrange) {

    d3.select("#slider_0").on("input", function() {
        params[0] = +this.value;
        update_bars(dist_name, params, xrange);
        update_misc(dist_name, params, xrange);
    });
    
    d3.select("#slider_1").on("input", function() {
        params[1] = +this.value;
        update_bars(dist_name, params, xrange);
        update_misc(dist_name, params, xrange);
    });

    d3.select("#slider_2").on("input", function() {
        params[2] = +this.value;
        update_bars(dist_name, params, xrange);
        update_misc(dist_name, params, xrange);
    });
}
