"use strict";

snappy.controller('SendPictureCtrl',
  function($scope, $ionicPlatform, $state, $timeout, FirebaseInteraction, ImageToSend, CurrentUser, $cordovaGeolocation) {

    // Get image to send
    $scope.imageToSend = ImageToSend.get();

    // User objects
    $scope.userList = null;
    $scope.usersToSendTo = null;

    // Get all users and store in userList
    firebase.database().ref('users').once('value', function(snapshot) {

      // Remove current user from userData
      var userData = snapshot.val();
      var theCurrentUserKey = CurrentUser.getUser().uid;
      for (var userKey in userData) {
        if (userKey === theCurrentUserKey) {
          delete userData[userKey];
        }
      }

      $scope.userList = userData;

    });

    // Home button pressed in navbar
    $scope.goHome = function() {
      $state.go('home');
    };

    // Values selected in user select, send image
    $scope.onValueChanged = function(value){


      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var currentLat  = position.coords.latitude;
          var currentLong = position.coords.longitude;



          $scope.usersToSendTo = value;
          $scope.usersToSendTo.forEach(function(user) {

            firebase.database().ref().child('picturemessages').push({
              image: $scope.imageToSend.image,
              senderId: CurrentUser.getUser().uid,
              senderName: CurrentUser.getUser().fullName,
              recipientId: user.uid,
              recipientName: user.fullName,
              lat: currentLat,
              long: currentLong
            });

          });

          $state.go('home');



        }, function(err) {
          console.log("GPS error", err);
        });

    };
});
