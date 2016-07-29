"use strict";

snappy.service("Auth", function($ionicPopup, $state, FirebaseInteraction, CurrentUser, $localStorage) {

  this.login = function(userEmail, userPassword) {

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {

        // Show login error
        $ionicPopup.show({
          title: "Login Error",
          template: error.message,
          buttons: [{
            text: 'Dismiss',
            type: 'button-default'
          }]
        });

    });

  };

  // Logs user out
  this.logout = function() {
    firebase.auth().signOut();
  };


  // Register function
  this.register = function(userEmail, userPassword, fullName) {

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(function(user) {

        // Show registration success
        $ionicPopup.show({
          title: "Registration Successful",
          template: "Your account has been created!",
          buttons: [{
            text: 'Dismiss',
            type: 'button-default'
          }]
        });

        FirebaseInteraction.addNewUserToFirebase(user.uid, userEmail, fullName);

        // Go to login page
        $state.go('login');
    });

  };


  firebase.auth().onAuthStateChanged(function(user) {
    // If logged in go to home, otherwise, back to login
    if (user) {
      CurrentUser.setUser(user.uid);
      $state.go('home');
    } else {
      CurrentUser.setUser(null);
      $state.go('login');
    }
  });



});
