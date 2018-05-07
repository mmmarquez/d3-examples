/*
        ___                     ___       
       /  /\      ___          /  /\      
      /  /::\    /  /\        /  /:/_     
     /  /:/\:\  /  /:/       /  /:/ /\    
    /  /:/~/:/ /__/::\      /  /:/ /:/_   
   /__/:/ /:/  \__\/\:\__  /__/:/ /:/ /\  
   \  \:\/:/      \  \:\/\ \  \:\/:/ /:/  
    \  \::/        \__\::/  \  \::/ /:/   
     \  \:\        /__/:/    \  \:\/:/    
      \  \:\       \__\/      \  \::/     
       \__\/                   \__\/      
                                          
*/

d3.csv("./assets/data.csv", csv_data => {
  //let's transform the data!
  // WE NEVER SAW NEST!
  // http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html

  let data = d3
    .nest() // call method nest
    .key(function (d) {
      // key refers to like the key, the name -- what is goign to be the parent to nest the values.
      return d.data_key;
    })
    .rollup(function (d) {
      // rollup is like the part we combining or doing soemthing to add as children / values of the keys
      return d3.sum(d, function (g) {
        // simple d3 sum() helper -- we are summing all the values.
        console.log(g); // g is new -- groups the values of the same key and sum them!
        return g.data_value;
      });
    })
    .entries(csv_data); // just d3 syntax, we end this function with .entries(data), to tell d3 to apply the nest to all entries (items) in data. basically!

  /*
  
    we got our data and transformed using that helper = .nest()!!
    now we have a varibale that has everythign divided by our "key" and total being "rollop"
    is like magic!

    nestedData = [
      { key: "sdgsdfg", value: 9812798123 },
      { key: "sdvdsv", value: 13312234 },
      etc...
    ]

  */

  //let's start by selecting our SVG and applying some width and height.
  let pieSvg = d3
    .select("#pie")
    .attr("width", 600)
    .attr("height", 600);

  // since we are trying to do a Pie Graph, we need to slice a circle.
  // d3 has helpers for that!

  // this little helper will take the data and creare the pie slices fo us.
  let myPie = d3.pie().value(function (d) {
    // returning the value column of our new data!!
    console.log(d.value);
    return d.value; // this is total number of deaths!
  });

  // we can then call this function and pass our data, returning our slices.
  // this would be complicated to calculate using pure math, but D3 makes it easier!
  let pieSlices = myPie(data);
  // console.log(pieSlices);

  // we start by usinf the .arc() method
  // basically to create the strcuture of our drawing using svg arcs
  let myArc = d3
    .arc()
    .innerRadius(0) // inner r
    .outerRadius(160); // outer r

  // this is a helper for mapping color.
  //https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
  // d3-scale-chromatic
  // it just scale values for us into a predifined colro scheme.
  let myColor = d3.scaleOrdinal(d3.schemeCategory10);

  // lets create the pie chart
  pieSvg
    .append("g") // append a group element to our svg
    // translate it -- since the anchor point is center
    // and default to the (0,0)
    // we move it 160px (r) from the left and the top
    .attr("transform", "translate(160,160)")
    .selectAll("path") // we selectAll paths -- to be created.
    .data(pieSlices) // pass the slice data
    .enter() // enter!
    .append("path") // appent a <path> per slice
    .attr("d", myArc) // d is path attribute, we use our myArc to return our arc.
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
    .attr("fill", function (d) {
      // we call our myColor color helper and pass a value from our data.
      // we write data due to being a PieChart!
      return myColor(d.data.value);
    });

  // let's add some labels
  // select our SVG


  // we need to separate logic, so we can nest two different elements in a single parent.

  // CREATE PARENT
  let parentPieSvg = pieSvg
    .append("g") // append another group!
    .attr("transform", "translate(360,0)")
    .attr("class", "captions") // add a class to that group
    .selectAll("text") // selectAll future <text> nodes.
    .data(pieSlices) // pass our data
    .enter() // enter it!


  // APEND CHILD KEYS (the ones with colo)
  // KEY : TITLES
  parentPieSvg.append("text")
    .text(function (d) {
      return d.data.key
    })
    .attr('font-size', 14)

    .attr("fill", function (d) {
      return myColor(d.data.value);
    })
    .attr("y", function (d, i) {
      return 30 * (i + 1);
    });

  // get parent again and append the VALUES!
  // VALUES! 
  parentPieSvg.append("text")
    .text(function (d) {
      return d.data.value
    })
    .attr('font-size', 9)
    .attr("y", function (d, i) {
      return 30 * (i + 1);
    })
    .attr("x", function (d, i) {
      // we move this to the right a little
      return 150;
    });

});