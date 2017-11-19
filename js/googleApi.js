const GoogleMapsLoader = require('google-maps')
const element = document.querySelector(".chart")

export const renderGoogleMap = locations => {
  GoogleMapsLoader.KEY = 'AIzaSyDyn2KgIJA92nNABdL9jGmSx5TSQpjk0PY'
  GoogleMapsLoader.load(function(google) {
    console.log('g', google)
    var geocoder = new google.maps.Geocoder()
    var map = new google.maps.Map(element, {
      center: new google.maps.LatLng(51.508742,-0.120850),
      zoom: 1
    })

    locations.forEach(location => {
      const createMarker = latlng => {
        new google.maps.Marker({
          map: map,
          position: latlng
        })
      }

      geocoder.geocode({address: location.name}, function(results, status) {
        console.log(status)
        if (status == google.maps.GeocoderStatus.OK) {
          var result = results[0].geometry.location;
          createMarker(result);
        }
      })
    })
  })
}
