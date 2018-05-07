/**
 *
 *
 * Loading Multiple Sources using queue()
 */

d3 // we can load multiple files.
  .queue()
  .defer(d3.json, "./data/points_geo.json") // ....
  .await(myExample); // then we use await and pass a function.
// this function we passed will contain the data fetched.

// we do all our logic inside this one.
function myExample(error, data) {
  // we can add new data by using forEach() on the data
  // once we get the data, let's loop each of the items and add new properties
  data.forEach((item, index) => {
    console.log(index, item)
    item.properties.description = "my description~~~"
  })
  console.log(data)

}