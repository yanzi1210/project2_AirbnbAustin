const Entirehomes = [];
const Privaterooms = [];
const Sharedrooms = [];
const xData = [];
var keysList = [];
var PrivateList = [];
var EntirehomesList = [];
var SharedroomsList = [];
var config = {};
const colors = {
  skyblue: {
    fill: 'skyblue',
    stroke: 'skyblue',
  },
  green: {
    fill: 'green',
    stroke: 'green',
  },
  yellowgreen: {
    fill: 'yellowgreen',
    stroke: 'yellowgreen',
  },
};

d3.json(`/stackedchartjs`).then(function (data) {

  var ctx = document.getElementById("myChart").getContext("2d");

  
  var SharedRoomsObj = data["Shared_room"];
  var PrivateRoomsObj = data["Private_room"]; 
  var EntireHomesObj = data["Entire_home_apt"];

  console.log(SharedRoomsObj)
  console.log(PrivateRoomsObj)
  console.log(EntireHomesObj)
 
  
  for (var key in PrivateRoomsObj){
    keysList.push(key)
    PrivateList.push(PrivateRoomsObj[key])
  }

  console.log(keysList)
  console.log(PrivateList)


  for (var key in EntireHomesObj ){
    EntirehomesList.push(EntireHomesObj[key])
  }

 
  for (var key in SharedRoomsObj ){
    SharedroomsList.push(SharedRoomsObj[key])
  }
  
  const Entirehomes = EntirehomesList;
  const Privaterooms = PrivateList;
  const Sharedrooms = SharedroomsList;
  const xData = keysList;

  
config =  {
  type: 'line',
  data: {
    labels: xData.slice(0,11),
    datasets: [{
      label: "Entire Home_Apartments",
      fill: true,
      backgroundColor: colors.yellowgreen.fill,
      pointBackgroundColor: colors.yellowgreen.stroke,
      borderColor: colors.yellowgreen.skyblue,
      pointHighlightStroke: colors.yellowgreen.stroke,
      borderCapStyle: 'butt',
      data: Entirehomes.slice(0,11),

    }, {
      label: "Private Room",
      fill: true,
      backgroundColor: colors.skyblue.fill,
      pointBackgroundColor: colors.skyblue.stroke,
      borderColor: colors.skyblue.stroke,
      pointHighlightStroke: colors.skyblue.stroke,
      borderCapStyle: 'butt',
      data: Privaterooms.slice(0,11),
    }, {
      label: "Shared Room",
      fill: true,
      backgroundColor: colors.green.fill,
      pointBackgroundColor: colors.green.stroke,
      borderColor: colors.green.stroke,
      pointHighlightStroke: colors.green.stroke,
      borderCapStyle: 'butt',
      data: Sharedrooms.slice(0,11),
    }]
  },
  options: {
    responsive: false,
    // Can't just just `stacked: true` like the docs say
    scales: {
      yAxes: [{
        stacked: true,
      }]
    },
    animation: {
      duration: 750,
    },
  }
}

console.log(config)
  var ctx = document.getElementById('myChart').getContext('2d');
  window.myLine = new Chart(ctx, config);
  
});




//window.onload = function() {

//};

// get new zip value along with data

document.getElementById('Addzip').addEventListener('click', function() {
  console.log('in update function');
    console.log(keysList);
    var zip = keysList[config.data.labels.length % keysList.length];
    var apt_new = EntirehomesList[config.data.labels.length % keysList.length];
    var private_new = PrivateList[config.data.labels.length % keysList.length];
    var shared_new = SharedroomsList[config.data.labels.length % keysList.length];
    config.data.labels.push(zip);
    config.data.datasets[0].data.push(apt_new);
    config.data.datasets[1].data.push(private_new);
    config.data.datasets[2].data.push(shared_new);
    window.myLine.update();
  });

  // remove zip and data 

  document.getElementById('Removezip').addEventListener('click', function() {
    config.data.labels.splice(-1, 1); // remove the label first

    config.data.datasets.forEach(function(dataset) {
      dataset.data.pop();
    });

    window.myLine.update();
  }); 
