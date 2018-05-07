// get the data
d3.csv("./assets/data.csv", function (error, data) {
    var chart = d3
        .select("#bar")
        .attr("width", 700)
        .attr("height", 600);

    let myColor = d3.scaleOrdinal(d3.schemeCategory10);

    var yScale = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(data, function (d) {
                return parseInt(d.data_value);
            })
        ])
        .rangeRound([400, 0]);

    let xScale = d3
        .scaleBand()
        .domain(
            data.map(function (d) {
                return d.data_key;
            })
        )
        .rangeRound([0, 500])
        .padding(0.1);

    var bars = chart.append("g");

    bars
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", d => {
            return myColor(d.data_key);
        })
        .attr("x", function (d) {
            return xScale(d.data_key);
        })
        .attr("y", function (d) {
            return yScale(d.data_value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return 400 - yScale(d.data_value);
        });

    bars.attr("transform", "translate(" + 100 + ",0)");

    yAxis = chart
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).ticks(10))
        .attr("transform", "translate(" + 100 + ",0)");

    xAxis = chart
        .append("g")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(" + 100 + "," + 400 + ")")
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45)");
});