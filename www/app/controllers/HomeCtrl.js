// "use strict";

snappy.controller('HomeCtrl', function($scope, $ionicPlatform, $cordovaCamera, $interval, $timeout, $localStorage, $sessionStorage, Auth, CurrentUser, $state, $ionicLoading, $ionicGesture, ImageToSend, TextRecipient, FirebaseInteraction, $cordovaLocalNotification, $cordovaToast) {

  $scope.imageViewing = false;
  var isInitialViewLoad = true;

  // On auth state change
  firebase.auth().onAuthStateChanged(function(theUser) {

    // If logged in go to home, otherwise, back to login
    if (theUser) {

    // // Timer vars
    $scope.timerActive = false;
    $scope.counter = 10;
    $scope.timer = null;


    $scope.mapit = function() {

      $state.go('snapmap');
      window.plugins.nativepagetransitions.slide(
        {"direction": "left"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    }

    // var newMessage = false;
    // firebase.database().ref('picturemessages').orderByChild('recipientId').equalTo(CurrentUser.getUser().uid).on('child_added', function(snapshot) {
    //   if (!newMessage) return;
    //   $cordovaToast.showShortTop(`New messge from ${snapshot.val().senderName}`).then(function(success) {
    //     // success
    //   }, function (error) {
    //     // error
    //   });
    // });
    // firebase.database().ref('picturemessages').orderByChild('recipientId').equalTo(CurrentUser.getUser().uid).on('value', function(snapshot) {
    //   newMessage = true;
    // });
    // $scope.$on('$ionicView.leave', function() {
    //   // Reset isInitialViewLoad on leave
    //   newMessage = false;
    // });

    // // Listen for any changes for new messages
    // firebase.database().ref('picturemessages').orderByChild('recipientId').equalTo(theUser.uid).on('child_added', function(snapshot) {
    //
    //   if (!isInitialViewLoad) {
    //     $cordovaToast.showShortTop(`New messge from ${snapshot.val().senderName}`).then(function(success) {
    //       // success
    //     }, function (error) {
    //       // error
    //     });
    //   }
    //
    //   isInitialViewLoad = false;
    // });
    //
    // $scope.$on('$ionicView.leave', function() {
    //   // Reset isInitialViewLoad on leave
    //   isInitialViewLoad = true;
    // });

    // Listen for any changes for new images
    firebase.database().ref('picturemessages').orderByChild('recipientId').equalTo(theUser.uid).on('value', function(snapshot) {

      // $cordovaLocalNotification.schedule({
      //   id: 1,
      //   title: 'New Message',
      //   text: 'You have a new snap!',
      //   data: {
      //     customProperty: 'custom value'
      //   }
      // }).then(function (result) {
      //   console.log('Notification triggered');
      // });

      $timeout(function() {
        $scope.collection = snapshot.val();
      });
    });

    // Message was right swiped on, open text screen
    $scope.sendTextSwipe = function(item) {
      var recipient = {uid: item.senderId, name: item.senderName};
      console.log("Sending to -", recipient.name);
      TextRecipient.set(recipient);
      $state.go('sendtext');
      window.plugins.nativepagetransitions.slide(
        {"direction": "right"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    };

    // Logout button pressed in nav bar
    $scope.logout = function() {
      Auth.logout();
      $scope.$storage = $localStorage;
      delete $scope.$storage.email;
      delete $scope.$storage.password;
      $state.go('login');
    };

    // Snap button pressed in nav bar
    $scope.picture = function() {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 375,
        targetHeight: 667,
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
        window.plugins.nativepagetransitions.slide(
          {"direction": "up"},
          function (msg) {console.log("success: " + msg)}, // called when the animation has finished
          function (msg) {alert("error: " + msg)} // called in case you pass in weird values
        );
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
        $scope.imageViewing = true;
      });
    };

    // Hides image overlay on release
    $scope.hide = function(){
      $ionicLoading.hide().then(function(){
        // Other logic
        $scope.imageViewing = false;
      });
    };


    // Logic for when image is held
    $scope.imageHeld = function(selected) {

      // Set selectedImage
      if (!$scope.timerActive) {
        $scope.selectedImage = selected;
      }

      // Show selected image
      var sourceString = 'data:image/jpeg;base64,' + selected.image;
      var img = `<div id="overlay">
                    <h1 id="counterDisplay">${$scope.counter}</h1>
                    <img id="snapImage" src="${sourceString}">
                   </div>`;
    //  var img = `<div id="overlay">
    //                <h1 id="counterDisplay">${$scope.counter}</h1>
    //                <img id="snapImage" src="${sourceString}">
    //             </div>`;

      if (selected.disabled === true) {
        console.log("IMAGE DISABLED");
      } else {

      // If there is not a timer active, start a new timer
      if(!$scope.timerActive) {
        $scope.show(img);
        $scope.timerActive = true;
        $scope.timer = $interval(function () {
          if($scope.counter == 1) {
            $interval.cancel($scope.timer);
            $scope.hide();
            console.log("Hiding:", selected);
            disableImage(selected);
            $scope.counter = 10;
            $scope.timerActive = false;
            // Reset selectedImage
            $scope.selectedImage = null;
          } else {
            $scope.counter--;
            console.log($scope.counter);
            if ($scope.imageViewing) {
              document.getElementById('counterDisplay').innerHTML = $scope.counter;
            }
          }
        }, 1000);
      } else if ($scope.timerActive && $scope.selectedImage === selected) {
        $scope.show(img);
      }

      }

    };

    // Logic for when image released
    $scope.imageReleased = function() {
      $scope.hide();
    };

    function disableImage(imageObj) {
      imageObj.disabled = true;
      FirebaseInteraction.disableImage(imageObj);
    };

  }});
});
