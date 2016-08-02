"use strict";

snappy.service("FirebaseInteraction", function($state, FirebaseCreds, $http) {

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

  this.getUserDataById = function(userId) {
    // return firebase.database().ref('users').child(userId).once('value', function(snapshot) {
    //   return snapshot.val();
    // });
    var queryString = `${FirebaseCreds.databaseURL}/users/${userId}.json?`;

    return $http.get(queryString).then(function(response){
        var userData = response;
        return userData;
    });
  }

  this.disableImage = function(imageObj) {
    firebase.database().ref('picturemessages').child(imageObj.id).update(imageObj);
  }

});
