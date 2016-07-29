"use strict";

snappy.controller('SendPictureCtrl',
  function($scope, $ionicPlatform, $state, $timeout, FirebaseInteraction, ImageToSend, CurrentUser) {

    // Get image to send
    $scope.imageToSend = ImageToSend.get();

    // User objects
    $scope.userList = null;
    $scope.usersToSendTo = null;

    // Get all users and store in userList
    firebase.database().ref('users').once('value', function(snapshot) {
      $scope.userList = snapshot.val();
    });

    // Home button pressed in navbar
    $scope.goHome = function() {
      $state.go('home');
    };

    // Values selected in user select, send image
    $scope.onValueChanged = function(value){
      $scope.usersToSendTo = value;
      $scope.usersToSendTo.forEach(function(user) {

        firebase.database().ref().child('users').child(user.uid).child('inbox').push({
          image: $scope.imageToSend.image,
          userId: CurrentUser.getUser().uid,
          fullName: CurrentUser.getUser().fullName
        });

      });

      $state.go('home');

    };
});
