function getdata(zipdata) {

  // Use `d3.json` to fetch the metadata for a zipcode

  d3.json(`/zipcode/listings/${zipdata}`).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var zipcodes = d3.select("#zip_listings");

    // Use `.html("") to clear any existing metadata
    zipcodes.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function ([key, value]) {
      var row = zipcodes.append("p");
      row.text(`${key}: ${value}`);
    });
  });

  d3.json(`/zipcode/price/${zipdata}`).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var zip_price = d3.select("#zip_price");

    // Use `.html("") to clear any existing metadata
    zip_price.html("");
    // Use `Object.entries` to add each key and value pair to the panel
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
