angular.module('twTwitter.directives.twReport', ['twTwitter.directives.twFeed'])

  .directive('twReport', function () {
    return {
      scope: true,
      restrict: 'EA',
      require: '^twFeed',
      templateUrl: '/static/js/modules/tw.twitter/templates/tw.report.html',

      link: function (scope, element, attrs, feedApi) {
        scope.tweetCount = 0;

        feedApi.on('tweet', function (tweet) {
          scope.$apply(function () {
            scope.tweetCount += 1;
          });
        });

        feedApi.on('track', function (terms) {
          scope.$apply(function () {
            scope.trackedTerms = terms;
          });
        });
      },
    }
  });

