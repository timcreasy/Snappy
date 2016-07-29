"use strict";

snappy.service("ImageToSend", function($state) {

  var image = null;

  this.get = function() {
    return image;
  };

  this.set = function(imageData) {
    image = imageData;
  };

});
