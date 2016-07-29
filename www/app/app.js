"use strict";

var snappy = angular.module('snappy', ['ionic','ngCordova', 'firebase', 'ngStorage', 'ionic-multiselect', 'monospaced.elastic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.disableScroll(true);
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
