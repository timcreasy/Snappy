snappy.controller('ViewFriendsCtrl',
  function($scope, $ionicPlatform, $state, CurrentUser, $timeout) {

    $scope.friendsList = [];
    $scope.pendingRequests = [];
    var userList = null;

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

      // Get all friends and requests and store in friendsList
      firebase.database().ref('users/').child(CurrentUser.getUser().uid).on('value', function(snapshot) {

        $timeout(function() {

          var friendsData = snapshot.val().friends;
          var requestsData = snapshot.val().requests;

          // Clear current state of friendsList and pendingRequests
          $scope.friendsList = [];
          $scope.pendingRequests = [];

          // Loop through and get full data for friends
          for (var friend in friendsData) {
            var currentFriend = friendsData[friend];
            // Loop through user data to find matching friend
            for (var user in userList) {
              if (currentFriend.uid === userList[user].uid) {
                $scope.friendsList.push(userList[user]);
              }
            }
          }

          // Loop through and get full data for requests
          for (var request in requestsData) {
            var currentRequest = requestsData[request];
            // Loop through user data to find matching request user
            for (var user in userList) {
              if (currentRequest.uid === userList[user].uid) {
                $scope.pendingRequests.push(userList[user]);
              }
            }
          }

        });

      })

    });


    $scope.addFriendsPressed = function() {
      $state.go('addfriend');
    }

    // Home button pressed
    $scope.goHome = function() {
      $state.go('home');
      window.plugins.nativepagetransitions.slide(
        {"direction": "right"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    }

    $scope.unfriendPressed = function(user) {

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
      });
    }


});
