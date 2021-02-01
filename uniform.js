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
        .domain([0, 10])
        .range([0, width]);
 
var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
 
    svg.append("g")
      .attr("class", "y-axis")    
      .call(d3.axisLeft(y));
 
var a_glob = 4, b_glob = 6;  // initial parameters

update(a_glob, b_glob)  // initial chart

function generate_data(a, b){

    var n = [];

    for (var i = 0; i < 10; i += 0.01) { 
        n.push(jStat.uniform.pdf(i, a, b));     
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
            .x(function(d) { return x(d[0] * 0.01) })  // 0.01 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) })
        );
}

d3.select("#a-slider").on("input", function() {
    update(this.value, b_glob);
});

d3.select("#b-slider").on("input", function() {
    update(a_glob, this.value);
});

function update(a, b) {
    
    d3.select("#a-value").text(a);
    d3.select("#a-slider").property("value", a);

    d3.select("#b-value").text(b);
    d3.select("#b-slider").property("value", b);
    
    a_glob = a
    b_glob = b

    d3.selectAll(".line").remove();  // clear chart
    
    data = generate_data(a, b);
    display = chart(data);

}
