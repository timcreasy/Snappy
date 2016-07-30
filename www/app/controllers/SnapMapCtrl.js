"use strict";

snappy.controller('SnapMapCtrl', function($scope, $state, $cordovaGeolocation, MapFactory) {

  MapFactory.init();

  $scope.goHome = function() {
    $state.go('home');
    window.plugins.nativepagetransitions.slide(
      {"direction": "down"},
      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
    );
  }

});
