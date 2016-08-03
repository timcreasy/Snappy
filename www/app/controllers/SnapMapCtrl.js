"use strict";

snappy.controller('SnapMapCtrl', function($scope, $state, $cordovaGeolocation, MapFactory, CurrentUser) {

  MapFactory.init();

  var newMessage = false;
  firebase.database().ref('picturemessages').orderByChild('recipientId').equalTo(CurrentUser.getUser().uid).on('child_added', function(snapshot) {
    if (!newMessage) return;
    $cordovaToast.showShortTop(`New messge from ${snapshot.val().senderName}`).then(function(success) {
      // success
    }, function (error) {
      // error
    });
  });
  firebase.database().ref('picturemessages').orderByChild('recipientId').equalTo(CurrentUser.getUser().uid).on('value', function(snapshot) {
    newMessage = true;
  });
  $scope.$on('$ionicView.leave', function() {
    // Reset isInitialViewLoad on leave
    newMessage = false;
  });

  $scope.goHome = function() {
    $state.go('home');
    window.plugins.nativepagetransitions.slide(
      {"direction": "right"},
      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
    );
  }

});
