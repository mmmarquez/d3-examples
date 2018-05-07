// https://github.com/d3/d3-geo
// https://medium.com/@c_behrens/enter-update-exit-6cafc6014c36
// https://geojson.io -> create your points_geo.json using that tool. copy + paste
// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f

/**
 *
 *
 * Async Data, geoJson, topoJson
 */

var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


// var width = w,
//   height = h;

var width = w,
  height = h,
  centered;

var svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3
  .geoAlbersUsa()
  // .center([-76.6, 39.3])
  // .rotate([0, 0])
  // .parallels([38, 40])
  // .translate([-1000, 900])
  .scale(27000)
  .translate([width - width * 11, height / 0.6])

// .scale(8000)
// .translate([-1300, height / 2]);

var path = d3.geoPath().projection(projection);

d3 // we can load multiple files.
  .queue()
  .defer(d3.json, "./data/maryland_topo.json") // file one
  .defer(d3.json, "https://data.baltimorecity.gov/resource/m8g9-abgb.geojson") // file one
  .await(makeMyMap); // then we use await and pass a function.
// this function we passed will contain the data fetched.

// we do all our logic inside this one.
function makeMyMap(error, state, calls) {

  // {
  //   "type": "FeatureCollection",
  //   "features": [{


  //   }, ]
  // }



  // calls.forEach(element => {

  //   let feature = [{
  //     type: "Feature",
  //     properties: {
  //       description: element.description,
  //       address: element.location_address,
  //       time: element.calldatetime,
  //       priority: element.priority,
  //       description: element.description,
  //     },
  //     geometry: {
  //       type: "Point",
  //       coordinates: element.location
  //     }
  //   }]
  //   features.push(feature)


  //   if (element.location) {
  //     // console.log('!!!!')
  //   } else {
  //     // delete element.location
  //     // console.log('deleted!')
  //   }
  //   // console.log(element.location)

  //   // need to add type to the model
  //   element.type = "Feature"
  //   //~~
  //   element.geometry = {} // create parent, add childs
  //   element.geometry.type = "Point"
  //   // console.log(element.location)
  //   // element.geometry.coordinates = 
  //   //~~
  //   element.properties = {} // create parent, add childs
  //   element.properties.description = element.description
  //   element.properties.address = element.location_address
  //   element.properties.time = element.calldatetime
  //   element.properties.priority = element.priority
  //   //~

  //   // if (element.location) {
  //   //   console.log(element.location)

  //   // } else {
  //   //   console.log('NAH!')
  //   // }
  //   // element.geometry.coordinates = element.location

  // })




  console.log(calls)

  /*
    {
      ":@computed_region_5kre_ccpb": "277",
      ":@computed_region_gwq4_fjxs": "35",
      ":@computed_region_s6p5_2pgr": "27307",
      "calldatetime": "2017-08-10T15:25:00.000",
      "callnumber": "P172221666",
      "description": "LARCENY",
      "district": "ND",
      "incidentlocation": "3100 ST PAUL ST",
      "location": {
        "type": "Point",
        "coordinates": [-76.615959,
          39.326142
        ]
      },
      "location_address": "3100 ST PAUL ST",
      "location_city": "BALTIMORE",
      "location_state": "MD",
      "priority": "Low",
      "recordid": "2749202"
    },
  */


  /*
  {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-112.1484375,
          43.83452678223682
        ]
      }
    }, ]
  }
  */


  console.log(state)
  svg
    .append("path")
    .datum(topojson.feature(state, state.objects.cb_2015_maryland_county_20m))
    .attr("d", path)
    .attr("class", "states")
    .on("click", clicked);

  svg
    .selectAll(".points")
    .data(calls.features)
    .enter()
    .append("path")
    .attr("d", path.pointRadius(1))
    .attr("class", "points");







  // ** Update data section (Called from the click)

}

// let centered;

function clicked(d) {
  var x, y, k;
  console.log(d)
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 2;
    centered = null;
  }

  svg.selectAll("path")
    .classed("active", centered && function (d) {
      return d === centered;
    });

  svg.transition()
    .duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
}