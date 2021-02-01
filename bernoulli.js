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
        .paddingInner(0.8);
 
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

var p_glob = 0.3;  // initial parameters

update(p_glob)  // initial chart

function generate_data(p){

    var n = [];

    for (var i = 0; i < 2; i += 1) { 
        n.push(bernoulli_pmf(i, p));  
    }
 
    data = n.map(function(d, i) {
            return[i, d];
        });

    return data;
}

function chart(data){  

    svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[0]) })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d[1]) })
      .attr("height", function(d) { return height - y(d[1]) });
   
}

d3.select("#p-slider").on("input", function() {
    update(this.value);
});

function update(p) {
    
    d3.select("#p-value").text(p);
    d3.select("#p-slider").property("value", p);

    
    p_glob = p


    d3.selectAll(".bar").remove();  // clear chart
    
    data = generate_data(p);
    display = chart(data);

}

function bernoulli_pmf(x, p){
    var pmf;
    if(x == 1) { pmf = p } else if( x == 0) { pmf = 1-p } else { pmf = 0 }
    return pmf;
  }