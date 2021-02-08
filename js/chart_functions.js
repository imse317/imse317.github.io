// This file contains common functions for making the d3 charts

// add the line for continuous distributions
function add_dist_line(dist_name, params) {

    var line = d3.line()
    .x(function(d) { return x(d[0]) })
    .y(function(d) { return y(d[1]) });

    var data = generate_data(dist_name, params);

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

// add the bars for discrete distributions
function add_dist_bars(dist_name, params){  

    var data = generate_data(dist_name, params);

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

// var darkred = "#b30000";
// var darkgreen = "#005800";

// function mouse_over() {
//         path.on("mouseover", function() {
//         d3.select(".line")
//             .style("stroke", darkred)
//             .style("stroke-width", 6);
//         })
//     .on("mouseout", function() {
//         d3.select(".line")
//             .style("stroke", "red")
//             .style("stroke-width", 5);
//         }); 

//        path.on("mouseover", function() {
//         d3.select(".line_reference")
//             .style("stroke", darkgreen)
//             .style("stroke-width", 6);
//         })
//     .on("mouseout", function() {
//         d3.select(".line_reference")
//             .style("stroke", "green")
//             .style("stroke-width", 5);
//         }); 
// }


// for continuous distributions
function initial_chart_line(dist_name, params) {

    add_dist_line(dist_name, params);

    // add transition
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

    // update controls unless there's no user control (e.g., standard normal)
    if (dist_name != "standard_normal") {
        update_controls(dist_name, params);
    }
}


// for discrete distributions
function initial_chart_bars(dist_name, params) {

    add_dist_bars(dist_name, params);

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
            .on("end", function() {add_bar_values(dist_name, params)});
    }

    update_controls(dist_name, params);
}

function add_bar_values(dist_name, params){

    var data = generate_data(dist_name, params);

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


function update_line(dist_name, params) {

    d3.selectAll(".line").remove();  // clear chart

    update_controls(dist_name, params);
    add_dist_line(dist_name, params);
}

function update_bars(dist_name, params) {
    
    d3.selectAll(".bar").remove();  // clear chart
    
    update_controls(dist_name, params);
    add_dist_bars(dist_name, params);
}


// update additional things that are specific to some distributions
function update_misc(dist_name, params) {

    switch (dist_name) {

        case "bernoulli":
            d3.selectAll(".bar-value").remove();
            add_bar_values(dist_name, params);
            break;

        case "normal": 
            d3.selectAll(".mean").remove();
            add_mean_line(dist_name, params);
            break;

    }

}

// generate the data that will be used to plot the distribution
function generate_data(dist_name, params){

    var data = [];

    switch (dist_name) {

        // discrete distributions

        case "bernoulli":
            data = data_bernoulli(params);
            break;

        case "binomial":
            data = data_binomial(params);
            break;

        case "geometric":
            data = data_geometric(params);
            break;

        case "hypgeom":
            data = data_hypergeom(params);
            break;

        case "poisson":
            data = data_poisson(params);
            break;

        case "uniform_discrete":
            data = data_uniform_discrete(params);
            break;

        // continuous distributions 

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
function update_chart_line(dist_name, params) {

    d3.select("#slider_0").on("input", function() {

        params[0] = +this.value;
        update_line(dist_name, params);
        update_misc(dist_name, params);
    });
    
    d3.select("#slider_1").on("input", function() {

        params[1] = +this.value;        
        update_line(dist_name, params);
        update_misc(dist_name, params);
    });
}


// call this function to make all the needed updates
function update_chart_bars(dist_name, params) {

    d3.select("#slider_0").on("input", function() {
        params[0] = +this.value;
        update_bars(dist_name, params);
        update_misc(dist_name, params);
    });
    
    d3.select("#slider_1").on("input", function() {
        params[1] = +this.value;
        update_bars(dist_name, params);
        update_misc(dist_name, params);
    });

    d3.select("#slider_2").on("input", function() {
        params[2] = +this.value;
        update_bars(dist_name, params);
        update_misc(dist_name, params);
    });
}


////////////////////////////////////////////////
// generate data for each distribution

// discrete distributions

function data_bernoulli(params) {

    var data = [];
    var p = params[0];

    for (var x = 0; x < 2; x += 1) { 
        var pmf = bernoulli_pmf(x, p);
        data.push([x, pmf]);
    }
    return data;
}


function data_binomial(params) {

    var data = [];
    var n = params[0];
    var p = params[1];

    for (var x = 0; x < 101; x += 1) { 
        var pmf = (x > n) ? 0 : jStat.binomial.pdf( x, n, p )
        data.push([x, pmf]);
    }
    return data;
}


function data_geometric(params) {

    var data = [];
    var p = params[0];

    for (var x = 0; x < 41; x += 1) {
        var pmf = geo_pmf(x, p);
        data.push([x, pmf]);
    }
    return data;
}


function data_hypergeom(params) {

    var data = [];
    var N = params[0];
    var K = params[1];
    var n = params[2];

    for (var x = 1; x < 61; x += 1) {
        var pmf = jStat.hypgeom.pdf(x, N, K, n);
        data.push([x, pmf]);
    }

    return data;
}


function data_poisson(params) {

    var data = [];
    var lambda = params[0];

    for (var x = 0; x < 21; x += 1) { 
        var pmf = jStat.poisson.pdf(x, lambda);
        data.push([x, pmf]);
    }
    return data;
}

function data_uniform_discrete(params) {

    var data = [];
    var a = params[0];
    var b = params[1];

    for (var x = 1; x < 11; x += 1) { 
        var pmf = uniform_pmf(x, a, b);
        data.push([x, pmf]);
    }
    return data;
}


// continuous distributions

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


//////////////////////////////////
// probability functions that are not available from jStat library

// the pmf of the bernoulli distribution
function bernoulli_pmf(x, p){
    var pmf;
    if(x == 1) { pmf = p } else if(x == 0) { pmf = 1-p } else { pmf = 0 }
    return pmf;
}

// the pmf of the discrete uniform distribution
function uniform_pmf(x, a, b){
    return (x < a || x > b) ? 0 : 1/(b-a+1);
  }

// the pmf of the geometric distribution
function geo_pmf(x, p) {
    return (x < 1) ? 0 : Math.pow(1-p,x-1)*p;
}
