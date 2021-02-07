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
        .domain(d3.range(21))
        .rangeRound([0, width], .1)
        .paddingInner(0.5);
 
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
    .call(yAxis
        .tickValues(d3.range(0, 1, 0.1))
        .tickFormat(d3.format('.1f'))
    );

var lambda_init = 4;  // initial params for poisson

var params = [lambda_init];

initial_chart(params);

function generate_data(params){

    var lambda = params[0];

    var data = [];

    for (var x = 0; x < 21; x += 1) { 
        var pmf = jStat.poisson.pdf(x, lambda);
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
          return i * 100;
      })
    .attr("y", function(d) { return y(d[1]) })
    .attr("height", function(d) { return height - y(d[1]) });

    mouseOver();

    update_controls(params);

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

// function chart(data){  

//     bars = svg.selectAll("bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x(d[0]) })
//       .attr("width", x.bandwidth())
//       .attr("y", function(d) { return y(d[1]) })
//       .attr("height", function(d) { return height - y(d[1]) });

//       mouseOver();
   
// }


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

    d3.selectAll(".bar").remove();  // clear chart
    
    update_controls(params);
    add_dist_bar(params);

}