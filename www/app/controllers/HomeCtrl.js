snappy.controller('HomeCtrl', function($scope, $ionicPlatform, $cordovaCamera, $interval, $timeout, $localStorage, $sessionStorage, Auth, CurrentUser, $state, $ionicLoading, $ionicGesture, ImageToSend, TextRecipient, FirebaseInteraction, $cordovaLocalNotification, $cordovaToast, $ionicPopover) {

  $ionicPopover.fromTemplateUrl('app/views/menu.html', {
      scope: $scope
   }).then(function(popover) {
      $scope.popover = popover;
   });

   $scope.openPopover = function($event) {
      $scope.popover.show($event);
   };

   $scope.closePopover = function() {
      $scope.popover.hide();
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });


  // Stores whether image is being viewed, as well as collection of pictures and texts
  $scope.imageViewing = false;
  $scope.collection = [];
  $scope.texts = [];

  // Only run when user is successfully logged in
  firebase.auth().onAuthStateChanged(function(theUser) {

    // If logged in go to home, otherwise, back to login
    if (theUser) {

    // // Timer vars
    $scope.timerActive = false;
    $scope.counter = 10;
    $scope.timer = null;

    // Snaptivity button pressed in navbar
    $scope.mapit = function() {
      // Go to snapmap view with transitions
      $state.go('snapmap');
      window.plugins.nativepagetransitions.slide(
        {"direction": "left"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    }

    // Listen for any changes for new picture messages
    firebase.database().ref('messages').orderByChild('recipientId').equalTo(theUser.uid).on('value', function(snapshot) {

      // Timeout to assist with ng-repeat of picture messages
      $timeout(function() {
        // Store data in messageCollection
        var messageCollection = snapshot.val();
        // Reset current state of collection
        $scope.collection = [];
        // Loop through all messages and only present active messagess
        for (var key in messageCollection) {
          if (messageCollection[key].disabled === true) {
            delete messageCollection[key];
          } else {
            $scope.collection.push(messageCollection[key]);
          }
        }
      });
    });

    // Listen for any changes for new texts
    firebase.database().ref('texts').on('value', function(snapshot) {

      // Timeout to assist with ng-repeat of text messages
      $timeout(function() {
        var textCollection = snapshot.val();
        $scope.texts = [];
        // Loop through all text conversations
        for (var key in textCollection) {
          // If current user is participant in thread, add and remove necessary data, push to texts collection
          if (key.indexOf(theUser.uid) !== -1) {
            var messageThread = textCollection[key];
            if (CurrentUser.getUser().fullName === messageThread.personOneName) {
              messageThread.senderId = messageThread.personTwoId;
              messageThread.senderName = messageThread.personTwoName;
            } else if (CurrentUser.getUser().fullName === messageThread.personTwoName) {
              messageThread.senderId = messageThread.personOneId;
              messageThread.senderName = messageThread.personOneName;
            }
            delete messageThread.personOneName;
            delete messageThread.personTwoName;
            delete messageThread.personOneId;
            delete messageThread.personTwoId;
            $scope.texts.push(messageThread);
          }
        }
      });
    });

    // Message was right swiped on, open text screen
    $scope.sendTextSwipe = function(item) {

      // Build recipient object, and go to sendtext view
      var recipient = {uid: item.senderId, name: item.senderName};
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
      // Logout user, and go to login view
      Auth.logout();
      $scope.$storage = $localStorage;
      delete $scope.$storage.email;
      delete $scope.$storage.password;
      $state.go('login');
    };

    // Snap button pressed in nav bar
    $scope.picture = function() {

      // Picture options
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

      // Take picture, and go to sendpicture view
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


      // If there is not a timer active, start a new timer
      if(!$scope.timerActive) {
        $scope.show(img);
        $scope.timerActive = true;
        $scope.timer = $interval(function () {
          if($scope.counter == 1) {
            $interval.cancel($scope.timer);
            $scope.hide();
            console.log("Hiding:", selected);
            delete selected.$$hashKey;
            console.log("Deleted hashkey", selected);
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

    };

    // Add 'fake' styling to camera button press
    $scope.camPressed = function() {
      console.log("Cam pressed");
      var cameraButton = angular.element( document.querySelector( '#cameraButton' ) );
      cameraButton.addClass('greyCamera');
    }

    // Add 'fake' styling to camera button press
    $scope.camReleased = function() {
      console.log("Cam released");
      var cameraButton = angular.element( document.querySelector( '#cameraButton' ) );
      cameraButton.removeClass('greyCamera');
    }

    // Logic for when image released
    $scope.imageReleased = function() {
      $scope.hide();
    };

    // Disables image after timer expiration
    function disableImage(imageObj) {
      imageObj.disabled = true;
      FirebaseInteraction.disableImage(imageObj);
    };

  }});
});
