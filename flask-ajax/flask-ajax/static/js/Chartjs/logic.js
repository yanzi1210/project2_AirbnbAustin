function getdata(zipdata) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a zipcode

  d3.json(`/zipcode/listings/${zipdata}`).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var zipcodes = d3.select("#zip_listings");

    // Use `.html("") to clear any existing metadata
    zipcodes.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key, value]) {
      var row = zipcodes.append("p");
      row.text(`${key}: ${value}`);
    });
  });

  //Fdosugfdsfa

  d3.json(`/zipcode/price/${zipdata}`).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var zip_price = d3.select("#zip_price");

    // Use `.html("") to clear any existing metadata
    zip_price.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key, value]) {
      var row = zip_price.append("p");
      row.text(`${key}: $${value}`);
    });
  });

};

function buildCharts(zipdata) {
  d3.json(`/zipchart/${zipdata}`).then(function (data) {
    var obj = JSON.parse(data["Roomtype_Listings"]);
    var obj2 = JSON.parse(data["Roomtype_Reviews"]);
    var obj3 = JSON.parse(data["Roomtype_avgprice"]);
    var keys = Object.keys(obj);
    console.log(keys);
    console.log(obj);
    var Room_Types = keys;
    var Roomtype_values = []
    var Roomtype_reviews = []
    var Roomtype_prices = []
    for (var i = 0; i < keys.length; i++) {
      var searchkey = keys[i];
      console.log(Room_Types);
      console.log(obj[keys[i]]);

      Roomtype_values.push(obj[searchkey]);
      Roomtype_reviews.push(obj2[searchkey]);
      Roomtype_prices.push(obj3[searchkey]);


      /* if (i == 1){
         Roomtype_reviews.push(obj[searchkey]);
         Roomtype_reviews.push(obj2[searchkey]);
         Roomtype_reviews.push(obj3[searchkey]);
         }

       if (i == 2){
         Roomtype_prices.push(obj[searchkey]);
         Roomtype_prices.push(obj2[searchkey]);
         Roomtype_prices.push(obj3[searchkey]);
         } */


    }

    console.log(Room_Types);
    console.log(Roomtype_values);
    console.log(Roomtype_reviews);
    console.log(Roomtype_prices);

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Room_Types,
        datasets: [{
          label: 'Listings count',
          data: Roomtype_values,
          backgroundColor: "rgba(153,255,51,1)"
        }, {
          label: 'Reviews Count',
          data: Roomtype_reviews,
          backgroundColor: "skyblue"
        }, {
          label: 'Average Price($)',
          data: Roomtype_prices,
          backgroundColor: "green"
        }]
      }
    });
  });
}

//   // @TODO: Use `d3.json` to fetch the sample data for the plots
//   var url = `/samples/${sample}`;
//   d3.json(url).then(function(data) {

//     // @TODO: Build a Bubble Chart using the sample data
//     var x_values = data.otu_ids;
//     var y_values = data.sample_values;
//     var m_size = data.sample_values;
//     var m_colors = data.otu_ids; 
//     var t_values = data.otu_labels;

//     var trace1 = {
//       x: x_values,
//       y: y_values,
//       text: t_values,
//       mode: 'markers',
//       marker: {
//         color: m_colors,
//         size: m_size
//       } 
//     };

//     var data = [trace1];

//     var layout = {
//       xaxis: { title: "OTU ID"},
//     };

//     Plotly.newPlot('bubble', data, layout);


//     // @TODO: Build a Pie Chart
//     d3.json(url).then(function(data) {  

//     var pie_values = data.sample_values.slice(0,10);
//       var pie_labels = data.otu_ids.slice(0,10);
//       var pie_hover = data.otu_labels.slice(0,10);

//       var data = [{
//         values: pie_values,
//         labels: pie_labels,
//         hovertext: pie_hover,
//         type: 'pie'
//       }];

//       console.log(data);

//       Plotly.newPlot('pie', data);

//     });
//   });   
// }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/zipcodes").then((zipcodes) => {
    zipcodes["zips"].forEach((zipcode) => {
      selector
        .append("option")
        .text(zipcode)
        .property("value", zipcode);
    });

    // Use the first sample from the list to build the initial plots
    const firstzip = zipcodes["zips"][0];
    getdata(firstzip)
    buildCharts(firstzip)
  });
}

function optionChanged(newZip) {
  // Fetch new data each time a new sample is selected

  getdata(newZip);
  buildCharts(newZip)
}

// Initialize the dashboard
init()
