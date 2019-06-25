
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
// }).addTo(map); // may nt want addTo() if you want to switch base layters
// }); // comment above and add this for L.map using layers: [various, layers, etc]

var SatelliteTile = addTileSatellite();

function addTileDark() {
  var mapdark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  minZoom: 1,
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
// // }).addTo(myMap);
  });
  return mapdark;
}

var darkTile = addTileDark();




// var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
// "35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(borough) {
  //Math.floor(Math.random() * (max - min + 1) ) + min
  rand = Math.floor(Math.random() * (9 - 0 + 1) ) + 0;
  switch (rand) {
  // case 0:
  //   return "red";
  // case 1:
  //   return "light green";
  // case 2:
  //   return "blue";
  // case 3:
  //   return "yellow";
  // case 4:
  //   return "orange";
  // case 5:
  //   return "purple";
  // case 6:
  //   return "green";
  // case 7:
  //   return "light blue";
  // case 8:
  //   return "pink";    
  // case "Queens":
  //   return "green";
  // case "Staten Island":
  //   return "purple";
  default:
    return "white";
  }
}


function plotZipAreas() {
  var link = "austin_area_zip_codes.geojson"; // looks like it works: 80 zip codes, but local data file stroage is non ideal
  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {
    console.log(data);
    // var oneFeature = data.features[5];
    // console.log(oneFeature);
    // L.geoJson(oneFeature, {
    L.geoJson(data, {
      style: function(feature) {
        return {
          color: "white",
          fillColor: chooseColor(feature.properties.zipcode),
          fillOpacity: 0.4,
          weight: 1
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.7
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },
          // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
          click: function(event) {
            map.fitBounds(event.target.getBounds());
          }
        });
        // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.zipcode + "</h1> <hr> <h2>" + feature.properties.name + ", TX" + "</h2>");
      }
    }).addTo(map);
  });
}


plotZipAreas();

listingMarkers = [];

// d3.json(url4geojson, function(GeoJson) {
//d3.csv("shortlistings.csv").then(function(listings) {
  function TheAllListingsPlotter() {
//    d3.csv("mmlistings.csv").then(function(theListings) {
      d3.csv("mmlistings.csv", function(theListings) {
        // Upon response, do some cool stuff...
        console.log(theListings);
        if (true) { // turn off listings plot
          // plotAllListings(theListings);
          // function plotAllListings(listings) {
            // function plotAllListings(listings, listingGroup) {
              var listingcount = 1;
                  theListings.forEach(listing => {
                    // convert some of the items from string to numeric...
                    listing.price = +listing.price;
                    listing.latitude = +listing.latitude;
                    listing.longitude = +listing.longitude;
                    listing.number_of_reviews = +listing.number_of_reviews;
                    listing.reviews_per_month = +listing.reviews_per_month;
                    // L.circle([listing.latitude, listing.longitude], {
                    listingMarkers.push(
                      L.circle([listing.latitude, listing.longitude], {
                        // stroke: false,
                        fillOpacity: 0.5,
                        color: "black",
                        weight: 0, // rendering speed cut by over 90% with weight = 0
                        // fillColor: "red",
                        fillColor: getGradedColor(listing.price),
                        // Setting our circle's radius equal to the output of our markerSize function
                        // This will make our marker's size proportionate to its population
                        radius: markerSize(listing.reviews_per_month)
                    // })
                      })
                      .bindPopup("<h3>" + listing.name + "</h3> <hr> <h4>price: $" + listing.price  + "</h4>")
                      .addTo(map)
                    );
                    listingcount += 1;
                  });
                  console.log(`Total listings plotted: ${listingcount}`);
            }
        if (false) {
          // plotZipOutlines(theListings); // don't need to pass  lisitngs
          // plotZipOutlines(); // don't need to pass lisitngs
        }
        if (false) {
          // other layers will go here
        }
    });
  }
  
  TheAllListingsPlotter();


  
var listingGroup = L.layerGroup(listingMarkers);


var baseMaps = {
                "Satellite Map: ": SatelliteTile,
                "Street Map:    ": StreetsTile,
                "Dark Map:      ": darkTile
//                "Satellite Map: ": mapsatellite
}
var overlayMaps =  {
                    
                    "Listing Cost/Reviews": listingGroup,                    
                    "Listing Type/Availability": listingGroup
                    // "Default ": null
}


L.control.layers(baseMaps, overlayMaps, {
  minZoom: 0,
  maxZoom: 12,
  collapsed: false
})
.addTo(map);