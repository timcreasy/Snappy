"use strict";

var snappy = angular.module('snappy', ['ionic','ngCordova', 'firebase', 'ngStorage', 'ionic-multiselect', 'monospaced.elastic', 'ionic-color-picker', 'ngMessages', 'ionic.service.core', 'ionic.service.push'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    // then override any default you want
    window.plugins.nativepagetransitions.globalOptions.duration = 250;
    window.plugins.nativepagetransitions.globalOptions.iosdelay = 60;
    window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 63;
    window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
