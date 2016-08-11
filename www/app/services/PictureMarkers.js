snappy.factory('PictureMarkers', function($http, CurrentUser, FirebaseCreds) {

  var markers = [];

  return {
    getMarkers: function(){

      var queryString = `${FirebaseCreds.databaseURL}/messages.json?orderBy="senderId"&equalTo="${CurrentUser.getUser().uid}"`;

      return $http.get(queryString).then(function(response){
          markers = response;
          return markers;
      });

      // firebase.database().ref('picturemessages').orderByChild('senderId').equalTo(CurrentUser.getUser().uid).on('value', function(snapshot) {
      //     var userPictures = snapshot.val();
      //     markers = [];
      //     for (var picture in userPictures) {
      //       markers.push(userPictures[picture]);
      //     }
      //     return markers;
      // });

    }
  }
});
