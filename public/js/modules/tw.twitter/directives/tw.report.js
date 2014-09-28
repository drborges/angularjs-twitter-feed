angular.module('twTwitter.directives.twReport', ['twTwitter.directives.twFeed'])

  .directive('twReport', function () {
    return {
      scope: true,
      restrict: 'E',
      require: '^twFeed',
      templateUrl: '/static/js/modules/tw.twitter/templates/tw.report.html',

      link: function (scope, element, attrs, feedApi) {
        scope.tweetCount = 0;

        feedApi.on('tweet', function (tweet) {
          ++scope.tweetCount;
        });

        feedApi.on('track', function (terms) {
          scope.trackedTerms = terms;
        });
      },
    }
  });

