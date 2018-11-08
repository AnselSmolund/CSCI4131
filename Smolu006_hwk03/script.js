var geocoder;
var map;
var icon;
var placeName;
var radius;
var classMarkers = [];
var placeMarkers = [];
var campus;
var directionsService;
var directionsDisplay;
var currentLat;
var currentLng;
function getCoordinates(eventName, address){
  geocoder.geocode({address:address}, function (results,status){
    var coords = results[0].geometry.location;
    var lat = coords.lat();
    var lng = coords.lng();
    createClassMarker(eventName,address,lat,lng);
  });

}
function createClassMarker(eventName,address,lat,lng){
  var marker = new google.maps.Marker({
    position: {lat: lat,lng: lng},
    icon: icon,
    map: map
  });
  var infoWindow = new google.maps.InfoWindow({
    content: eventName
  });
  google.maps.event.addListener(marker,'mouseover',function(){
    infoWindow.open(map,this);
  });
  google.maps.event.addListener(marker,'mouseout',function(){
    infoWindow.close(map,this);
  });
  classMarkers.push(marker);
}
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  icon = "images/gopher.png";
  geocoder = new google.maps.Geocoder();
  var addresses = document.getElementsByClassName("location");
  var events = document.getElementsByClassName("courseNum");
  navigator.geolocation.getCurrentPosition(function(position){
    getCurrentLocation(position);
  });
  campus = {lat: 44.9727, lng: -93.23540000000003};
  map = new google.maps.Map(
  document.getElementById('map'), {zoom: 14, center: campus});
  directionsDisplay.setMap(map);
  for(var i = 0; i < addresses.length; i++){
    getCoordinates(events[i].innerText,addresses[i].innerText);
  }
}

function createPlaceMarker(place){
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
  var infoWindow = new google.maps.InfoWindow({
    content: place.name
  });
  google.maps.event.addListener(marker,'mouseover',function(){
    infoWindow.open(map,this);
  });
  google.maps.event.addListener(marker,'mouseout',function(){
    infoWindow.close(map,this);
  });
  placeMarkers.push(marker);
}
function placesCallback(results,status){
  for(var i = 0; i < results.length; i++){
    createPlaceMarker(results[i]);
  }
}
function setMapOnAll(markers,map){
  for(var i = 0; i < markers.length;i++){
    markers[i].setMap(map);
  }
}
function findPlace(){
  setMapOnAll(classMarkers, null);
  setMapOnAll(placeMarkers,null);
  directionsDisplay.setMap(null);
  var service = new google.maps.places.PlacesService(map);
  radius = document.getElementById('radius').value;
  if(document.getElementById('placeName').value == "other"){
    service.nearbySearch({
      location: {lat: currentLat, lng: currentLng},
      radius: radius,
      name: [document.getElementById('otherPlace').value]
    }, placesCallback);
  }else{
    service.nearbySearch({
      location: {lat: currentLat, lng: currentLng},
      radius: radius,
      type: [document.getElementById('placeName').value]
    }, placesCallback);
  }
}
function changeTextBox(){
  if(document.getElementById('placeName').value == "other"){
    document.getElementById('otherPlace').disabled = false;
  }else{
    document.getElementById('otherPlace').disabled = true;
  }
}
function getCurrentLocation(position){
  currentLat = position.coords.latitude;
  currentLng = position.coords.longitude;
}
function getDirections(){
  var mode;
  var currentLocation;
  directionsDisplay.setMap(map);
  setMapOnAll(classMarkers, null);
  setMapOnAll(placeMarkers,null);
  if(document.getElementById('mode1').checked){
    mode = document.getElementById('mode1').value;
  }
  if(document.getElementById('mode2').checked){
    mode = document.getElementById('mode2').value;
  }
  if(document.getElementById('mode3').checked){
    mode = document.getElementById('mode3').value;
  }
  var start = {lat: currentLat, lng: currentLng};

  var destination = document.getElementById('directionToPlace').value;
  console.log(start.lat + " " + destination);

  var request ={
    origin: start,
    destination: destination,
    travelMode: mode
  };
  directionsService.route(request, function(result,status){
    directionsDisplay.setDirections(result);
  });
  directionsDisplay.setPanel(document.getElementById('routeSteps'));
}
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}
