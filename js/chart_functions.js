// This file contains common functions for making the d3 charts

// add the distribution line for continuous distributions
function add_dist_line(dist_name, params) {

    var line = d3.line()
    .x(function(d) { return x(d[0]) })
    .y(function(d) { return y(d[1]) });

    data = generate_data(dist_name, params);

    // special treatment for standard normal
    if (dist_name != "standard_normal") {

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

var darkred = "#b30000";
var darkgreen = "#005800";

function mouse_over() {
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

       path.on("mouseover", function() {
        d3.select(".line_reference")
            .style("stroke", darkgreen)
            .style("stroke-width", 6);
        })
    .on("mouseout", function() {
        d3.select(".line_reference")
            .style("stroke", "green")
            .style("stroke-width", 5);
        }); 
}

var dist_continuous = ["chisquare", "exponential", "normal", "standard_normal", "studentt", "uniform"];

// plot the initial chart with transition
function initial_chart(dist_name, params){

    add_dist_line(dist_name, params);

    // add transition

    // for continuous distributions
    if (dist_continuous.includes(dist_name)) {

        var totalLength = path.node().getTotalLength();

        if ( dist_name != "normal" && dist_name != "standard_normal") {
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
    }

    // mouse_over();

    // update controls unless there's no control (e.g., standard normal)
    if (dist_name != "standard_normal") {
        update_controls(dist_name, params);
    }
 }


// update the main elements in the chart (i.e., distribution lines, bars)
function update_main(dist_name, params) {
    
    d3.selectAll(".line, .bar").remove();  // clear chart
    
    update_controls(dist_name, params);
    add_dist_line(dist_name, params);
}


// update other miscellaneous things specific to a distribution
function update_misc(dist_name, params) {

    if (dist_name == "normal") {
        d3.selectAll(".mean").remove();
        add_mean_line(dist_name, params);
    }

}

// generate the data that will be used to plot the distribution
function generate_data(dist_name, params){

    var data = [];

    switch (dist_name) {

        case "chisquare":
            data = data_chisquare(params);
            break;
            
        case "exponential": 
            data = data_exponential(params);
            break;

        case "normal":
            data = data_normal(params);
            break;

        case "standard_normal":
            data = data_standard_normal();
            break;

        case "studentt":
            data = data_studentt(params);
            break;

        case "uniform":
            data = data_uniform(params);
            break;

    }
 
    return data;
}

// update the controls (e.g., sliders)
function update_controls(dist_name, params) {

    d3.select("#slider_0").property("value", params[0]);
    d3.select("#slider_1").property("value", params[1]);

    // set how many decimal places to keep for display
    switch (dist_name) {

        case "chisquare": 
            d3.select("#slider_value_0").text(params[0].toFixed(0));
            break;

        case "exponential": 
            d3.select("#slider_value_0").text(params[0].toFixed(1));
            break;

        case "normal":
            d3.select("#slider_value_0").text(params[0].toFixed(1));
            d3.select("#slider_value_1").text(params[1].toFixed(1));
            break;

        case "studentt": 
            d3.select("#slider_value_0").text(params[0].toFixed(0));
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
function update_chart(dist_name, params) {

    d3.select("#slider_0").on("input", function() {
        params[0] = +this.value;
        update_main(dist_name, params);
        update_misc(dist_name, params);
    });
    
    d3.select("#slider_1").on("input", function() {
        params[1] = +this.value;
        update_main(dist_name, params);
        update_misc(dist_name, params);
    });
}

////////////////////////////////////////////////
// generate data for each distribution

function data_chisquare(params) {

    var data = [];
    var dof = params[0];

    for (var x = 0.01; x < 16 + 0.2; x += 0.1) {     // make the line extend slightly beyond the x-axis
        var pdf = jStat.chisquare.pdf(x, dof);
        data.push([x, pdf]);
    }
    return data;
}


function data_exponential(params) {

    var data = [];
    var lambda = params[0];

    for (var x = 0; x < 5 + 0.05; x += 0.01) {     // make the line extend slightly beyond the x-axis
        var pdf = jStat.exponential.pdf(x, lambda);
        data.push([x, pdf]);
    }
    return data;
}


function data_normal(params) {

    var data = [];
    var mu = params[0];
    var sigma = params[1];

    for (var x = 0; x < 50 + 0.5; x += 0.1) {      // make the line extend slightly beyond the x-axis
        var pdf = jStat.normal.pdf(x, mu, sigma);
        data.push([x, pdf]);
    }
    return data;
}


function data_standard_normal() {

    var data = [];
    var mu = 0;
    var sigma = 1;

    for (var x = -5; x < 5 + 0.1; x += 0.01) {    // make the line extend slightly beyond the x-axis
        var pdf = jStat.normal.pdf(x, mu, sigma);
        data.push([x, pdf]);       
    }
    return data;
}


function data_studentt(params) {

    var data = [];
    var dof = params[0];

    for (var x = -5; x < 5 + 0.1; x += 0.01) {
        var pdf = jStat.studentt.pdf(x, dof);
        data.push([x, pdf]);         
    }
    return data;
}


function data_uniform(params) {

    var data = [];
    var a = params[0];
    var b = params[1];

    for (var x = 0; x < 10 + 0.1; x += 0.01) {   // make the line extend slightly beyond the x-axis
        var pdf = jStat.uniform.pdf(x, a, b);
        data.push([x, pdf]);  
    }
    return data;
}