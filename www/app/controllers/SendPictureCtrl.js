"use strict";

snappy.controller('SendPictureCtrl',
  function($scope, $ionicPlatform, $state, $timeout, FirebaseInteraction, ImageToSend, CurrentUser, $cordovaGeolocation, $http, FirebaseCreds, Timestamp, $cordovaToast) {

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

    // Set initial pen color to be black
    $scope.testColors = {
     first : "#000000"
   }

    // Get image to send
    $scope.imageToSend = ImageToSend.get();

    var canvas = document.getElementById('drawCanvas');
    var drawArea = new SignaturePad(canvas);

    // Listen for any changes to color selection, and change penColor
    $scope.$watch('testColors.first', function() {
      drawArea.penColor = $scope.testColors.first;
    });

    $scope.clearCanvas = function() {
      drawArea.clear();
      var ctx = canvas.getContext("2d");
      var image = new Image();
      image.onload = function() {
          ctx.drawImage(image, 0, 0);
      };
      image.src = `data:image/jpeg;base64,${$scope.imageToSend.image}`;
    }

    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.onload = function() {
        ctx.drawImage(image, 0, 0);
    };
    image.src = `data:image/jpeg;base64,${$scope.imageToSend.image}`;

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
      window.plugins.nativepagetransitions.slide(
        {"direction": "down"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    };

    // Values selected in user select, send image
    $scope.onValueChanged = function(value){


      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var currentLat  = position.coords.latitude;
          var currentLong = position.coords.longitude;

          var imgToSend = null;

          // If there is a drawing
          if (!drawArea.isEmpty()) {

            var drawImg = drawArea.toDataURL();
            var getImage = drawImg.split(',');
            imgToSend = getImage[1];

          } else {
            imgToSend = $scope.imageToSend.image;
          }

          $scope.usersToSendTo = value;
          $scope.usersToSendTo.forEach(function(user) {

            var uniqueKey = uuid.v4();
            var messageTimestamp = Timestamp.get();

            firebase.database().ref().child('picturemessages').child(uniqueKey).set({
              disabled: false,
              image: imgToSend,
              senderId: CurrentUser.getUser().uid,
              senderName: CurrentUser.getUser().fullName,
              recipientId: user.uid,
              recipientName: user.fullName,
              lat: currentLat,
              long: currentLong,
              id: uniqueKey,
              timestamp: messageTimestamp
            });

          });

          $state.go('home');
          window.plugins.nativepagetransitions.slide(
            {"direction": "down"},
            function (msg) {console.log("success: " + msg)}, // called when the animation has finished
            function (msg) {alert("error: " + msg)} // called in case you pass in weird values
          );

        }, function(err) {
          console.log("GPS error", err);
        });

    };
});
