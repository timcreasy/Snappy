"use strict";

snappy.service("FriendRequested", function() {

  var requested = null;

  this.get = function() {
    return requested;
  };

  this.set = function(newRequested) {
    requested = newRequested;
  };

});
