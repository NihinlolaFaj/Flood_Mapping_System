/**
 * @description The Javscript that controls the functionality of the Map
 * @author Nihinlolamiwa Fajemilehin, Timothy Shirgba
 * @version 1.0
 */

var map;
const requestURL = 'http://environment.data.gov.uk/flood-monitoring/id/stations';
const stationsURL = 'http://localhost:3001/api/stations';
const mqttURL = 'http://localhost:3001/api/mqtt';

/**
 * Function that initialises the map and displays neccesary markers
 * on the map
 */
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 51.297500, lng: 1.069722 },
    zoom: 10
  });

  // Make call to the Station URL and return result
  var requestOne = new XMLHttpRequest();
  requestOne.open('GET', stationsURL);
  requestOne.responseType = 'json';
  requestOne.send();

  requestOne.onload = function () {
    var myresults = requestOne.response;
    showLocation(myresults, map);
  }

  // Make call to the MQTT URL and return result
  var requestTwo = new XMLHttpRequest();
  requestTwo.open('GET', mqttURL);
  requestTwo.responseType = 'json';
  requestTwo.send();

  requestTwo.onload = function () {
    var myresults = requestTwo.response;
    getMqttValues(myresults, map);
  }

  var geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function () {
    geocodeAddress(geocoder, map);
  });
}

/**
 * Function that takes in a the JSON object of all locations retrieved and displays the locations
 * as markers on the Map  
 * @param {*} jsonObj The JSON object that contains all the locations retrieved
 */
function showLocation(jsonObj, myMap) {
  var locations = jsonObj['myCollection'];
  var markers = [];

  for (var i = 0; i < locations.length; i++) {
    var latitude = locations[i].lat;
    var longitude = locations[i].long;
    var station = locations[i].label;
    var latLng = new google.maps.LatLng(latitude, longitude);

    markers[i] = new google.maps.Marker({
      position: latLng,
      map: map,
      title: station
    });

    markers[i].index = i;

    google.maps.event.addListener(markers[i], 'click', function () {
      console.log("I was clicked");
      map.setZoom(10);
      map.setCenter(markers[this.index].getPosition());
    });
  }
}

/**
 * 
 */
function getMqttValues(jsonObj) {
  var mqttValues = jsonObj['myCollection'];
  console.log(mqttValues);
}

/**
 *  Function that displays the location entered in the search box on the Map
 * @param {*} geocoder The geocoder object
 * @param {*} resultsMap The map object
 */
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      // Uncomment to allow marker be displayed on search location
      // var marker = new google.maps.Marker({
      //   map: resultsMap,
      //   position: results[0].geometry.location
      // });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  //Bind address searched to the view
  document.getElementById('placeSearched').innerHTML = address;
}

/**
 * Function that displays the current time and date 
 */
window.onload = function getDate() {
  var d = new Date();
  document.getElementById('currentDate').innerHTML = d.toUTCString();
};
