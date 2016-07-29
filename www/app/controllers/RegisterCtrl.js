"use strict";

snappy.controller('RegisterCtrl',
  function($scope, $ionicPlatform, Auth, $state) {

    // Login button pressed in navbar
    $scope.loginPressed = function() {
      $state.go('login');
    };

    // Register object model for inputs
    $scope.register = {
      email:  "",
      password: "",
      fullName: "",
    };

    // Register button pressed
    $scope.registerPressed = function() {
      Auth.register($scope.register.email, $scope.register.password, $scope.register.fullName);
    };

});
