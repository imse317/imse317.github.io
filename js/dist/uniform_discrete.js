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
        .domain(d3.range(11))
        .rangeRound([0, width], .1)
        .paddingInner(0.8);
 
var y = d3.scaleLinear()
        .domain([0, 0.5])
        .range([height, 0]);
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
 
    svg.append("g")
      .attr("class", "y-axis")    
      .call(d3.axisLeft(y));

var a_glob = 1, b_glob = 6;  // initial parameters

chart_init(update(a_glob, b_glob))  // initial chart

function generate_data(a, b){

    var n = [];

    for (var i = 1; i < 11; i += 1) { 
        n.push(uniform_pmf(i, a, b));  
    }
 
    data = n.map(function(d, i) {
            return[i+1, d];
        });

    return data;
}

var darkred = "#cc0000";

function chart_init(data){  

    bars = svg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[0]) })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d[1]) })
    .attr("height", function(d) { return height - y(d[1]) });

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

function chart(data){  

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

d3.select("#a-slider").on("input", function() {
    chart(update(this.value, b_glob));
});

d3.select("#b-slider").on("input", function() {
    chart(update(a_glob, this.value));
});

function update(a, b) {
    
    d3.select("#a-value").text(a);
    d3.select("#a-slider").property("value", a);

    d3.select("#b-value").text(b);
    d3.select("#b-slider").property("value", b);
    
    a_glob = a;
    b_glob = b;

    d3.selectAll(".bar").remove();  // clear chart
    
    data = generate_data(+a, +b);
    
    return data;

}

function uniform_pmf(x, a, b){
    return (x < a || x > b) ? 0 : 1/(b-a+1);
  }