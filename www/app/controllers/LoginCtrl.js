"use strict";

snappy.controller('LoginCtrl', function($scope, $ionicPlatform, Auth, $localStorage, $ionicLoading, $state) {

    // Register button pressed in nav bar
    $scope.registerPressed = function() {
      $state.go('register');
      window.plugins.nativepagetransitions.slide(
        {"direction": "left"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    };

    // Login object model for inputs
    $scope.login = {
      email:  "",
      password: ""
    };

    // Reference to local storage
    $scope.$storage = $localStorage;

    // Login button was pressed
    $scope.loginPressed = function() {
      Auth.login($scope.login.email, $scope.login.password);
      $scope.$storage.email = $scope.login.email;
      $scope.$storage.password = $scope.login.password;
      $scope.login.email = "";
      $scope.login.password = "";
    };
  }
);
