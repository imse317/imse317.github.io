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
  
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        //   .tickValues(d3.range(0, 21, 5))
        );
 
    svg.append("g")
      .attr("class", "y-axis")    
      .call(d3.axisLeft(y)
      .tickValues(d3.range(0, 1, 0.1))
      );

var lambda_glob = 4;  // initial parameters

update(lambda_glob)  // initial chart

function generate_data(lambda){

    var n = [];

    for (var i = 0; i < 21; i += 1) { 
        n.push(jStat.poisson.pdf( i, lambda ));  
        
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


d3.select("#lambda-slider").on("input", function() {
    update(this.value);
});

function update(lambda) {

    d3.select("#lambda-value").text(lambda);
    d3.select("#lambda-slider").property("value", lambda);
    
    lambda_glob = lambda

    d3.selectAll(".bar").remove();  // clear chart
    
    data = generate_data(+lambda); // use the plus sign to make sure they are converted to numbers
    display = chart(data);

}

