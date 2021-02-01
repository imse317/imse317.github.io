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
        .domain(d3.range(101))
        .rangeRound([0, width], .1)
        .paddingInner(0.5);
 
var y = d3.scaleLinear()
        .domain([0, 0.25])
        .range([height, 0]);
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
          .tickValues(d3.range(0, 101, 5))
        );
 
    svg.append("g")
      .attr("class", "y-axis")    
      .call(d3.axisLeft(y)
      .tickValues(d3.range(0, 1, 0.05))
      );

var n_glob = 40, p_glob = 0.5;  // initial parameters

update(n_glob, p_glob)  // initial chart

function generate_data(n, p){

    var n_data = [];

    for (var i = 0; i < 101; i += 1) { 
        n_data.push((i > n) ? 0 : jStat.binomial.pdf( i, n, p ));  
        
    }
 
    data = n_data.map(function(d, i) {
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

d3.select("#n-slider").on("input", function() {
    update(this.value, p_glob);
});

d3.select("#p-slider").on("input", function() {
    update(n_glob, this.value);
});

function update(n, p) {
    
    d3.select("#n-value").text(n);
    d3.select("#n-slider").property("value", n);

    d3.select("#p-value").text(p);
    d3.select("#p-slider").property("value", p);
    
    n_glob = n
    p_glob = p

    d3.selectAll(".bar").remove();  // clear chart
    
    data = generate_data(+n, +p); // use the plus sign to make sure they are converted to numbers
    display = chart(data);

}