snappy.controller('AddFriendCtrl',
  function($scope, $ionicPlatform, $state, CurrentUser) {

    var userList = null;
    $scope.foundUser = null;
    $scope.requestButtonText = "Send Friend Request";

    // Get all users and store in userList
    firebase.database().ref('users').on('value', function(snapshot) {

      var userData = snapshot.val();

      // Remove current user from userData
      var theCurrentUserKey = CurrentUser.getUser().uid;
      for (var userKey in userData) {
        if (userKey === theCurrentUserKey) {
          delete userData[userKey];
        }
      }

      userList = userData;

    });

    // Home button pressed
    $scope.goHome = function() {
      $state.go('home');
      window.plugins.nativepagetransitions.slide(
        {"direction": "right"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    }


    $scope.searchFriends = function(searchQuery) {

      // Reset button text
      $scope.requestButtonText = "Send Friend Request";
      // Remove disabled property if active
      document.getElementById("friendRequestButton").disabled = false;

      // cordova.plugins.Keyboard.close();

      // Loop through and see if user exists and match was found
      for (var key in userList) {
        var currentSearchedUser = userList[key];
        if (currentSearchedUser.email === searchQuery) {
          $scope.foundUser = currentSearchedUser;
        }
      }

      // Loop through and see if request already sent
      for (var request in $scope.foundUser.requests) {
        if ($scope.foundUser.requests[request].uid === CurrentUser.getUser().uid) {
          // Request already sent, disable button
          $scope.requestButtonText = "Friend Request Pending";
          document.getElementById("friendRequestButton").disabled = true;
        }
      }

    }

    $scope.friendRequestPressed = function(friendToAdd) {
      // Style button
      $scope.requestButtonText = "Friend Request Pending";
      document.getElementById("friendRequestButton").disabled = true;

      // Send request to firebase to requested friends node
      firebase.database().ref('users/' + friendToAdd.uid).child('requests').push({
        fullName: CurrentUser.getUser().fullName,
        uid: CurrentUser.getUser().uid
      });


    }


});
