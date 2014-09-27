angular.module('twTwitter.directives.twFeed', ['twTwitter.services'])

  .directive('twFeed', function (TwitterFeed) {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '/static/js/modules/tw.twitter/templates/tw.feed.html',

      scope: {
        trackingTerms: '@track'
      },

      link: function (scope, element, attrs, controller) {
        scope.tweets = [];
        scope.$watch('trackingTerms', function (newTrackingTerms, oldTrackingTerms) {
          controller.untrack(oldTrackingTerms);
          controller.track(newTrackingTerms);
        });
      },

      controller: function ($scope) {
        var api = this;
        var listeners = {
          'tweet': [],
          'track': [],
          'untrack': []
        };

        api.track = function (terms) {
          if (terms) {
            TwitterFeed.on(terms, api.receive);
            api.emit('track', terms);
          }
        };

        api.untrack = function (terms) {
          if (terms) {
            TwitterFeed.untrack(terms);
            api.emit('untrack', terms);
          }
        };

        api.receive = function (tweet) {
          $scope.$apply(function () {
            $scope.tweets.unshift(tweet);
          });

          api.emit('tweet', tweet);
        };

        api.emit = function (event, data) {
          listeners[event].forEach(function (listener) {
            listener(data);
          });
        };

        api.on = function (event, listener) {
          listeners[event].push(listener);
        };
      }
    };
  });

