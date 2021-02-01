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
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
 
    svg.append("g")
      .attr("class", "y-axis")    
      .call(d3.axisLeft(y));
 
var dof_glob = 1;  // initial parameters

update(dof_glob)  // initial chart

data_z = generate_data_z()
chart_z(data_z)

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

    svg.append('path')
        .attr("class", "line_1")
        .datum(data)
        .attr("d", d3.line()
            .x(function(d) { return x(d[0] * 0.01 - 5) })  // 0.01 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) })
        );
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

function chart(data){  

    svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", d3.line()
            .x(function(d) { return x(d[0] * 0.01 - 5) })  // 0.01 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) })
        );

}

d3.select("#dof-slider").on("input", function() {
    update(this.value);
});

function update(dof) {
    
    d3.select("#dof-value").text(dof);
    d3.select("#dof-slider").property("value", dof);

    dof_glob = dof

    d3.selectAll(".line").remove();  // clear chart
    
    data = generate_data(dof);
    display = chart(data);

}
