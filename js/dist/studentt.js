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
 
var dof_glob = 1;  // initial parameters

chart_init(update(dof_glob));  // initial chart

data_z = generate_data_z();
chart_z(data_z);

function generate_data_z(){

    var n = [];

    for (var i = -5; i < 5; i += 0.01) {
        n.push(jStat.normal.pdf(i, 0, 1));        
    }
 
    data = n.map(function(d, i) {
            return[i, d];
        });

    return data;   
    
}

function chart_z(data){  


    var line = d3.line()
            .x(function(d) { return x(d[0] * 0.01 - 5) })  // 0.1 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) });

        path = svg.append('path')
        .attr("class", "line_1")
        .datum(data)
        .attr("d", line);

        // var totalLength = path.node().getTotalLength();

        // path.attr("stroke-dasharray", totalLength + " " + totalLength)
        //     .attr("stroke-dashoffset", totalLength)
        //     .transition()
        //     .duration(1000)
        //     .ease(d3.easeLinear)
        //     .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition;


        path.on("mouseover", function() {
            d3.select(".line_1")
                .style("stroke", darkgreen)
                .style("stroke-width", 7);
            })
          .on("mouseout", function() {
            d3.select(".line_1")
                .style("stroke", "darkgreen")
                .style("stroke-width", 5);
            }); 
}

function generate_data(dof){

    var n = [];

    for (var i = -5; i < 5; i += 0.01) {
        n.push(jStat.studentt.pdf(i, +dof));        
    }
 
    data = n.map(function(d, i) {
            return[i, d];
        });

    return data;   
    
}

function chart_init(data){

    var line = d3.line()
            .x(function(d) { return x(d[0] * 0.01 - 5) })  // 0.1 is the delta corresponding to the for loop
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
    chart(update(this.value));
});

function update(dof) {
    
    d3.select("#dof-value").text(dof);
    d3.select("#dof-slider").property("value", dof);

    dof_glob = dof;

    d3.selectAll(".line").remove();  // clear chart
    
    data = generate_data(dof);

    return data;

}
