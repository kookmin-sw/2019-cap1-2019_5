let map;
let geocoder;
let latlng;
let initLocation = {lat:37.570204, lng: 126.976956}; // 서울 중심 좌표: 37.570204 , 126.976956
function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: initLocation,
    zoom: 16, // zoom level 은 0~20. 16=default 0=earth, 20=buildings
    //,disableDefaultUI: true,zoomControl: false,
    scaleControl: true
  });
  geocoder = new google.maps.Geocoder();
  setupEvents();
  centerChanged();
}
function setupEvents() {
  centerChangedLast = new Date();
  google.maps.event.addListener(map, 'center_changed', centerChanged);
  google.maps.event.addDomListener(document.getElementById('crosshair'),'dblclick', function() {
     map.setZoom(map.getZoom() + 1);
  });
}
function getCenterLatLngText() {
  return '(' + map.getCenter().lat() +', '+ map.getCenter().lng() +')';
}
function centerChanged() {
  centerChangedLast = new Date();
  let latlng = getCenterLatLngText();
  document.getElementById('latlng').innerHTML = latlng;
  currentReverseGeocodeResponse = null;
}
function geocode() {
  let address = document.getElementById("address").value;
  geocoder.geocode({
    'address': address,
    'partialmatch': true}, geocodeResult);
}
function geocodeResult(results, status) {
  if (status == 'OK' && results.length > 0) {
    map.fitBounds(results[0].geometry.viewport);
  } else {
    alert("Geocode was not successful for the following reason: " + status);
  }
}
