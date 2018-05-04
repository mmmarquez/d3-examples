// https://github.com/d3/d3-geo
// https://medium.com/@c_behrens/enter-update-exit-6cafc6014c36
// https://geojson.io -> create your points_geo.json using that tool. copy + paste
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f

/**
 *
 *
 * Async Data, geoJson, topoJson
 */

var width = 960,
  height = 500;

var svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3
  .geoAlbersUsa()
  .scale(1000)
  .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

d3 // we can load multiple files.
  .queue()
  .defer(d3.json, "./data/states_topo.json") // file one
  .defer(d3.json, "./data/points_geo.json") // ....
  .defer(d3.json, "./data/points_geo_two.json")
  .defer(d3.json, "./data/line_geo.json")
  .await(makeMyMap); // then we use await and pass a function.
// this function we passed will contain the data fetched.

// we do all our logic inside this one.
function makeMyMap(error, states, points, pointsTwo, line) {
  svg
    .append("path")
    .datum(topojson.feature(states, states.objects.usStates))
    .attr("d", path)
    .attr("class", "states");
  svg
    .selectAll(".points")
    .data(points.features)
    .enter()
    .append("path")
    .attr("d", path.pointRadius(10))
    .attr("class", "points");
  svg
    .selectAll(".points-two")
    .data(pointsTwo.features)
    .enter()
    .append("path")
    .attr("d", path.pointRadius(20))
    .attr("class", "points-two");

  svg
    .selectAll(".line")
    .data(line.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "line");
}

// ** Update data section (Called from the click)
document.querySelector("#update").addEventListener("click", () => {
  update();
});

// this is the update function. we call it on button click.
function update() {
  d3
    .queue()
    .defer(d3.json, "./data/points_geo_three.json")
    .defer(d3.json, "./data/line_geo_two.json")
    .await(updateMap);
  // we load our data array and pass the new function.
  // everything is basically the same!

  function updateMap(error, pointsThree, lineTwo) {
    // this is the function that receives the async data.
    // note that for update we are NOT creating, just selecting and updating.

    d3 // we use the d3. instead of the svg. when we where appending/creating.
      .selectAll(".points-two") // select all .points-two
      .data(pointsThree.features) // pass the data. Note we don't enter!
      .transition() // transition
      .duration(750) // transition
      .attr("d", path); // generate new path based on pointsThree.

    d3 // same as above.
      .selectAll(".line")
      .data(lineTwo.features)
      .transition()
      .duration(750)
      .attr("d", path);
  }
}
