"use strict";

snappy.controller('HomeCtrl', function($scope, $ionicPlatform, $cordovaCamera, $interval, $timeout, $localStorage, $sessionStorage, Auth, CurrentUser, $state, $ionicLoading, $ionicGesture, ImageToSend, TextRecipient) {

  // On auth state change
  firebase.auth().onAuthStateChanged(function(theUser) {

    // If logged in go to home, otherwise, back to login
    if (theUser) {

    // // Timer vars
    $scope.timerActive = false;
    $scope.counter = 5;
    $scope.timer = null;

    // // Listen for any changes for new images
    firebase.database().ref('users').child(theUser.uid).child('inbox').on('value', function(snapshot) {
      $timeout(function() {
        $scope.collection = snapshot.val();
      });
    });

    $scope.sendTextSwipe = function(item) {
      var recipient = {uid: item.userId, name: item.fullName};
      TextRecipient.set(recipient);
      $state.go('sendtext');
    };

    // Logout button pressed in nav bar
    $scope.logout = function() {
      Auth.logout();
      $state.go('login');
    };

    // Snap button pressed in nav bar
    $scope.picture = function() {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1080,
        targetHeight: 1920,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
  	    correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        ImageToSend.set({
          image: imageData,
          userId: CurrentUser.getUser().uid,
          fullName: CurrentUser.getUser().fullName
        });
        $state.go('sendpicture');
      }, function(err) {
        // error
      });

    };

    // Shows image overlay on hold
    $scope.show = function(image) {
      $ionicLoading.show({
        template: image
      }).then(function(){
        // Other logic
      });
    };

    // Hides image overlay on release
    $scope.hide = function(){
      $ionicLoading.hide().then(function(){
        // Other logic
      });
    };


    // Logic for when image is held
    $scope.imageHeld = function(selected) {

      // Show selected image
      var sourceString = 'data:image/jpeg;base64,' + selected.image;
      var img = `<div id="overlay">
                    <h1 id="counterOutput">${$scope.counter}</h1>
                    <img id="snapImage" src="${sourceString}">
                   </div>`;
      $scope.show(img);


      // If there is not a timer active, start a new timer
      if(!$scope.timerActive) {
        $scope.timerActive = true;
        $scope.timer = $interval(function () {
          if($scope.counter == 1) {
            $interval.cancel($scope.timer);
            $scope.hide();
            $scope.counter = 5;
            $scope.timerActive = false;
          } else {
            $scope.counter--;
            console.log($scope.counter);
            document.getElementById('counterOutput').innerHTML = $scope.counter;
          }
        }, 1000);
      }

    };

    // Logic for when image released
    $scope.imageReleased = function() {
      $scope.hide();
    };

  }});
});
