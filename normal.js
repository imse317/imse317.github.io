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
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
 
    svg.append("g")
      .attr("class", "y-axis")    
      .call(d3.axisLeft(y));
 
var mu_glob = 25, sigma_glob = 6;  // initial parameters

update(mu_glob, sigma_glob)  // initial chart

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

function chart(data){  

    svg.append('path')
        .attr("class", "line")
        .datum(data)
        .attr("d", d3.line()
            .x(function(d) { return x(d[0] * 0.1) })  // 0.1 is the delta corresponding to the for loop
            .y(function(d) { return y(d[1]) })
        );
}

d3.select("#mu-slider").on("input", function() {
    update(this.value, sigma_glob);
});

d3.select("#sigma-slider").on("input", function() {
    update(mu_glob, this.value);
});

function update(mu, sigma) {
    
    d3.select("#mu-value").text(mu);
    d3.select("#mu-slider").property("value", mu);

    d3.select("#sigma-value").text(sigma);
    d3.select("#sigma-slider").property("value", sigma);
    
    mu_glob = mu
    sigma_glob = sigma

    d3.selectAll(".line").remove();  // clear chart
    
    data = generate_data(+mu, +sigma);
    display = chart(data);

}
