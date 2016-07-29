snappy.factory('MapFactory', function($cordovaGeolocation, PictureMarkers){

  var apiKey = false;
  var map = null;

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){

        //Load the markers
        loadMarkers();

      });

    }, function(error){
      console.log("Could not get location");

        //Load the markers
        loadMarkers();
    });

  }

  function loadMarkers(){

      //Get all of the markers from our Markers factory
      PictureMarkers.getMarkers().then(function(markers){

        var records = [];

        // Load markers into array
        for (var markerKey in markers.data) {
          records.push(markers.data[markerKey]);
        }

        for (var i = 0; i < records.length; i++) {

          var record = records[i];
          var markerPos = new google.maps.LatLng(record.lat, record.long);

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos
          });

          // var infoWindowContent = "<h4>Sent to: " + record.recipientName + "</h4>";
          var infoWindowContent = `<div class="markerContainer"> 
                                    <h4>Sent to: ${record.recipientName}</h4>
                                    <img class="markerImage" alt="Sent image" src="data:image/png;base64,${record.image}"/>
                                   </div>`;

          addInfoWindow(marker, infoWindowContent, record);

        }

      });

  }

  function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });

  }

  return {
    init: function(){
      initMap();
    }
  }

})
