/**
 *
 *
 * Loading Multiple Sources using queue()
 */

d3 // we can load multiple files.
  .queue()
  .defer(d3.json, "./data/states_topo.json") // file one
  .defer(d3.json, "./data/points_geo.json") // ....
  .defer(d3.json, "./data/line_geo.json")
  .await(makeMyMap); // then we use await and pass a function.
// this function we passed will contain the data fetched.

// we do all our logic inside this one.
function makeMyMap(error, states, points, line) {

  console.log(states, points, line)
  // we can place our D3 stuff inside this function.

}