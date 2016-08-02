"use strict";

snappy.config(function($stateProvider, $urlRouterProvider, FirebaseCreds, $ionicConfigProvider, $ionicAppProvider){

  //
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '9139b002',
    // The public API key all services will use for this app
    api_key: 'a9427e9c9382bce38f4abe6183a18d7cb534039b4b26b0dd',
    // Set the app to use development pushes
    dev_push: true
  });


  $ionicConfigProvider.views.maxCache('0');
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.views.swipeBackEnabled(false);

  // Configure Firebase
  var authConfig = {
    apiKey: FirebaseCreds.apiKey,
    authDomain: FirebaseCreds.authDomain,
    databaseURL: FirebaseCreds.databaseURL,
    storageBucket: FirebaseCreds.storageBucket,
  };
  firebase.initializeApp(authConfig);

  // Handle routes to different views
  $stateProvider
  .state('index',{
      url:'/',
      templateUrl: 'app/views/loading.html',
      controller: 'LoadingCtrl'
  })
  .state('login',{
    url:'/login',
    templateUrl: 'app/views/login.html',
    controller: 'LoginCtrl'
  })
  .state('register',{
    url:'/register',
    templateUrl: 'app/views/register.html',
    controller: 'RegisterCtrl'
  })
  .state('home',{
      url:'/home',
      templateUrl: 'app/views/home.html',
      controller: 'HomeCtrl'
  })
  .state('sendpicture',{
      url:'/sendpicture',
      templateUrl: 'app/views/sendpicture.html',
      controller: 'SendPictureCtrl'
  })
  .state('sendtext',{
      url:'/sendtext',
      templateUrl: 'app/views/sendtext.html',
      controller: 'SendTextCtrl'
  })
  .state('snapmap',{
      url:'/snapmap',
      templateUrl: 'app/views/snapmap.html',
      controller: 'SnapMapCtrl'
  });
  $urlRouterProvider.otherwise('/');
});
