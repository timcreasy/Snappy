"use strict";

snappy.controller('LoadingCtrl', function($scope, $localStorage, $state, Auth) {

  // Get reference to local storage
  $scope.$storage = $localStorage;

  // If there is login info stored, use that to attempt to login, otheriwse go to login screen
  if ($scope.$storage.email !== undefined && $scope.$storage.password !== undefined) {
    Auth.login($scope.$storage.email, $scope.$storage.password);
  } else {
    $state.go('login');
  }

});
