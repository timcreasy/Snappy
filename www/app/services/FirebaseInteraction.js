"use strict";

snappy.service("FirebaseInteraction", function($state) {

  // Adds new user to firebase
  this.addNewUserToFirebase = function(uid, email, fullName, userPicture) {
    firebase.database().ref().child('users').child(uid).set({
      uid: uid,
      email: email,
      fullName: fullName,
      profilePicture: userPicture
    });
  };

  // Returns list of firebase users
  this.getUsers = function() {
    return firebase.database().ref('users').once('value', function(snapshot) {
      return snapshot.val();
    });
  };

});
