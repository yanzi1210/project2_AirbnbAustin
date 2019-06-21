
// Define a markerSize function that will give each city a different radius based on its population
function markerSize(sizeWanted) {
  // return population / 40; // convert from population in .1-10 million
  return sizeWanted * 100; // convert to Richter scale in .5-10 .
}

function getGradedColor(parm1) {
  if (parm1 > 200) {return "red"}
  else if (parm1 > 100) {return "orange"}
  else if (parm1 > 80) {return "yellow"}
  else if (parm1 > 60) {return "green"}
  else if (parm1 > 40) {return "blue"}
  else if (parm1 > 20) {return "purple"}
  else {return "white"}
}

// Creating map object
function MakeMap() {
  var mapptr = L.map("map", {
    // center: [40.7128, -74.0059], // NYC
    center: [30.2672,-97.7431], // AUstin TX
    zoom: 10
  });
  return mapptr;
}

var map = MakeMap();


function addTileStreets(addToMap) {
  // Adding tile layer
  var tileStreets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    }).addTo(addToMap); // we addTo so that this will be the default map view
  return tileStreets;
}

var StreetsTile = addTileStreets(map);

function addTileSatellite() {
  var mapSatellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  minZoom: 1,
  maxZoom: 18,
  // id: "mapbox.dark",
  id: "mapbox.satellite",
  accessToken: API_KEY
  });
  return mapSatellite;
}

var SatelliteTile = addTileSatellite();

function addTileDark() {
  var mapdark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  minZoom: 1,
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  });
  return mapdark;
}

var darkTile = addTileDark();

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(borough) {
  //Math.floor(Math.random() * (max - min + 1) ) + min
  rand = Math.floor(Math.random() * (9 - 0 + 1) ) + 0;
  switch (rand) {
  
  default:
    return "white";
  }
}

 listingMarkersZipCode = [];
  function TheAllListingsPlotterZipCode(zipcode) {
    //    d3.csv("mmlistings.csv").then(function(theListings) {
      
          d3.json(`/leaflet/${zipcode}`).then( function(theListings) {
            // Upon response, do some cool stuff...
            console.log(theListings);
            var priceObj = theListings["price"]
            console.log(priceObj)
            var latObj = theListings["latitude"]
            var lonObj = theListings["longitude"]
            var reviewsObj = theListings["number_of_reviews"]
            var monReviewsObj = theListings["reviews_per_month"]
            if (true) { // turn off listings plot
              // plotAllListings(theListings);
              // function plotAllListings(listings) {
                // function plotAllListings(listings, listingGroup) {
                  var listingcount = 1;
                  var obj = theListings["index"]
                  var keys = Object.keys(obj);
                  for (var i = 0; i < keys.length; i++) { {
                        // convert some of the items from string to numeric...
                        var searchKey = keys[i]
                        price = +priceObj[searchKey];
                        latitude = +latObj[searchKey];
                        longitude = +lonObj[searchKey];
                        number_of_reviews = +reviewsObj[searchKey];
                        reviews_per_month = +monReviewsObj[searchKey];
                        name = 
                        // L.circle([listing.latitude, listing.longitude], {
                          listingMarkersZipCode.push(
                          L.circle([latitude, longitude], {
                            // stroke: false,
                            fillOpacity: 0.5,
                            color: "black",
                            weight: 0, // rendering speed cut by over 90% with weight = 0
                            // fillColor: "red",
                            fillColor: getGradedColor(price),
                            // Setting our circle's radius equal to the output of our markerSize function
                            // This will make our marker's size proportionate to its population
                            radius: markerSize(reviews_per_month)
                        // })
                          })
                          .bindPopup("<h4>price: $" + price  + "</h4>")
                          .addTo(map)
                        );
                        listingcount += 1;
                      };
                      console.log(`Total listings plotted: ${listingcount}`);
                }
            if (false) {
            }
        };
      });
  }  

  
//var listingGroup = L.layerGroup(listingMarkers);
var listingGroupZipCode = L.layerGroup(listingMarkersZipCode);


var baseMaps = {
                "Satellite Map: ": SatelliteTile,
                "Street Map:    ": StreetsTile,
                "Dark Map:      ": darkTile
//                "Satellite Map: ": mapsatellite
}
var overlayMaps =  {
                    
                    "Listing Cost": listingGroupZipCode,                    
                    // "Listing Type/Availability": listingGroupZipCode,
                    // "Room Type - Entire House/Apartment": listingGroupZipCode,
                    // "Room Type - Shared Room/Bath": listingGroupZipCode,
                    // "Room Type - Single Room": listingGroupZipCode
                    // "Default ": null
}

L.control.layers(baseMaps, overlayMaps, {
  minZoom: 0,
  maxZoom: 12,
  collapsed: false
})
.addTo(map);


function getdata(zipdata) {

  // Use `d3.json` to fetch the metadata for a zipcode

  d3.json(`/zipcode/listings/${zipdata}`).then(function (data) {
    // Use d3 to select the panel with id zip_listings
    var zipcodes = d3.select("#zip_listings");

    // Use `.html("") to clear any existing metadata
    zipcodes.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key, value]) {
      var row = zipcodes.append("p");
      row.text(`${key}: ${value}`);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of zipcodes to populate the dropdown options
  d3.json("/zipcodes").then(function(zipcodes) {
    console.log(zipcodes)

    zipcodes["zips"].forEach( (zipcode) => {
      selector
        .append("option")
        .text(zipcode)
        .property("value", zipcode);
    });

    // Use the first sample from the list to build the initial plots
    const firstzip = zipcodes["zips"][0];
    getdata(firstzip)
    TheAllListingsPlotterZipCode(firstzip)
  });

  
}


function optionChanged(newZip) {
  // Fetch new data each time a new sample is selected

  getdata(newZip);
  var newmap=d3.select('#map')
  TheAllListingsPlotterZipCode(newZip)
}


init()