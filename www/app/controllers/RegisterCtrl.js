"use strict";

snappy.controller('RegisterCtrl',
  function($scope, $ionicPlatform, Auth, $state, $cordovaImagePicker, $cordovaCamera) {

    var options = {
     maximumImagesCount: 1,
     width: 384,
     height: 490,
     quality: 50
    };

    $scope.profilePicture = null;

    $scope.getProfilePicture = function() {
      $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        toDataUrl(results[0], function(base64Img) {
          $scope.$apply(function() {
            $scope.profilePicture = base64Img;
          });
        });
      }, function(error) {
        // error getting photos
      });
    };

    $scope.takeProfilePicture = function() {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 384,
        targetHeight: 490,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
  	    correctOrientation:true,
        cameraDirection: 1
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.profilePicture = "data:image/png;base64," + imageData;
      });

    };

    function toDataUrl(src, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
      };
      img.src = src;
      if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
      }
    }

    // Login button pressed in navbar
    $scope.loginPressed = function() {
      $state.go('login');
      window.plugins.nativepagetransitions.slide(
        {"direction": "right"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    };

    // Register object model for inputs
    $scope.register = {
      email:  "",
      password: "",
      fullName: "",
    };

    // Register button pressed
    $scope.registerPressed = function() {
      Auth.register($scope.register.email, $scope.register.password, $scope.register.fullName, $scope.profilePicture);
    };

});
