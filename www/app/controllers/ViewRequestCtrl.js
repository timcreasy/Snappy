"use strict";

snappy.controller('ViewRequestCtrl', function($scope, $state, FriendRequested, CurrentUser, $timeout) {

  // Set requested Friend
  var requested = FriendRequested.get().uid;

  // Get user profile
  firebase.database().ref('users').child(requested).on('value', function(snapshot) {
    $timeout(function() {
      $scope.requestedFriend = snapshot.val();
    });
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
