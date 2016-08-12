snappy.controller('AddFriendCtrl',
  function($scope, $ionicPlatform, $state, CurrentUser) {

    var userList = null;
    var friendsList = null;
    var pendingRequests = null;
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

    // Get all friends and requests and store in friendsList
    firebase.database().ref('users/').child(CurrentUser.getUser().uid).on('value', function(snapshot) {

      friendsList = snapshot.val().friends;
      pendingRequests = snapshot.val().requests;

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

      $scope.searchEmail = searchQuery;
      $scope.noMatch = true;
      $scope.existingFriends = false;

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
          $scope.noMatch = false;
        }
      }

      // Loop through and see if request already sent from current user
      for (var request in $scope.foundUser.requests) {
        if ($scope.foundUser.requests[request].uid === CurrentUser.getUser().uid) {
          // Request already sent, disable button
          $scope.requestButtonText = "Friend Request Pending";
          document.getElementById("friendRequestButton").disabled = true;
        }
      }

      // Loop through and see if request already sent from other user
      for (var requestKey in pendingRequests) {
        if (pendingRequests[requestKey].uid === $scope.foundUser.uid && $scope.noMatch === false) {
          // Request already sent, disable button
          $scope.requestButtonText = "Friend Request Pending";
          document.getElementById("friendRequestButton").disabled = true;
        }
      }

      // Loop through and ensure not already friends
      for (var friend in friendsList) {
        if (friendsList[friend].uid === $scope.foundUser.uid && $scope.noMatch === false) {
          $scope.existingFriends = true;
        }
      }

    }

    $scope.unfriendUserPressed = function(user) {

      // Remove friendship from firebase from other users friends node
      firebase.database().ref('users/').child(user.uid).child('friends').once('value', function(snapshot){
        var friendData = snapshot.val();
        // Loop thorugh all friends
        for (var friend in friendData) {
          if (friendData[friend].uid === CurrentUser.getUser().uid) {
            firebase.database().ref('users/').child(user.uid).child('friends').child(friend).remove();
          }
        }
      });

      // Remove friendship from firebase from current user's friends node
      firebase.database().ref('users/' + CurrentUser.getUser().uid).child('friends').once('value', function(snapshot){
        var friendData = snapshot.val();
        // Loop thorugh all friends
        for (var friend in friendData) {
          if (friendData[friend].uid === user.uid) {
            firebase.database().ref('users/').child(CurrentUser.getUser().uid).child('friends').child(friend).remove();
          }
        }

        $scope.searchFriends(user.email)
      });

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

    $scope.inviteUser = function(userEmail) {
      cordova.plugins.email.open({
        to:      userEmail,
        subject: 'Check out Snappy!',
        body:    "I recently tried to add you on Snappy, but you were not a user! Check it out <a href='http://www.timcreasy.com'>here!</a>",
        isHtml:  true
      });
    }


});
