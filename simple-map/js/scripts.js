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
  .await(makeMyMap); // then we use await and pass a function.
// this function we passed will contain the data fetched.

// we do all our logic inside this one.
function makeMyMap(error, states, points) {
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
}