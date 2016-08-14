"use strict";

snappy.controller('ViewRequestCtrl', function($scope, $state, FriendRequested, CurrentUser, $timeout) {

  // Set requested Friend
  var requested = FriendRequested.get();

  // Get user profile
  firebase.database().ref('users').child(requested.uid).on('value', function(snapshot) {
    $timeout(function() {
      $scope.requestedFriend = snapshot.val();
    });
  });

  $scope.goHome = function() {
    $state.go('home');
    window.plugins.nativepagetransitions.slide(
      {"direction": "right"},
      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
    );
  }

  $scope.ignoreFriendPressed = function(ignoredFriend) {

    firebase.database().ref('users/').child(CurrentUser.getUser().uid).child('requests').child(requested.firebaseKey).update({
      fullName: requested.fullName,
      uid: requested.uid,
      ignored: true
    });

    $scope.goHome();

  }

  $scope.addFriendPressed = function(addedFriend) {

    // Send friendship to firebase to requested friends node
    firebase.database().ref('users/' + addedFriend.uid).child('friends').push({
      fullName: CurrentUser.getUser().fullName,
      uid: CurrentUser.getUser().uid
    });

    // Send friendship to firebase to current user's friends node
    firebase.database().ref('users/' + CurrentUser.getUser().uid).child('friends').push({
      fullName: addedFriend.fullName,
      uid: addedFriend.uid
    });

    // Remove request from firebase's  current user's request node
    firebase.database().ref('users/' + CurrentUser.getUser().uid).child('requests').child(requested.firebaseKey).remove();

    $scope.goHome();

  }

});
