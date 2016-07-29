"use strict";

snappy.controller('LoginCtrl', function($scope, $ionicPlatform, Auth, $localStorage, $ionicLoading, $state) {

    // Register button pressed in nav bar
    $scope.registerPressed = function() {
      $state.go('register');
    };

    // Login object model for inputs
    $scope.login = {
      email:  "",
      password: ""
    };

    // Reference to locat storage
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
