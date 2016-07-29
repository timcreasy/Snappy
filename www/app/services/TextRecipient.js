"use strict";

snappy.service("TextRecipient", function() {

  var recipient = null;

  this.get = function() {
    return recipient;
  };

  this.set = function(newRecipient) {
    recipient = newRecipient;
  };

});
