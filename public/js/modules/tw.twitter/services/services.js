angular.module('twTwitter.services', [])

  .service('TwitterFeed', function () {

    this.on = function (hashtags, callback) {
      var socket = io.connect();

      socket.emit('track', hashtags);

      socket.on('tweet', function (tweet) {
        callback(tweet);
      });
    };

    this.untrack = function (hashtags) {
      var socket = io.connect();
      socket.emit('untrack', hashtags);
    };
  });
