"use strict";

snappy.service("CurrentUser", function($state) {

  var currentUser = null;
  // var user = null;

  this.getUser = function() {
    return currentUser;
  };

  this.setUser = function(userID) {

    console.log(userID);

    if(userID !== null) {
      firebase.database().ref().child('users').child(userID).once('value', function(snapshot) {
        currentUser = snapshot.val();
        console.log("currentuser", currentUser);
      });
    }

  };

});
