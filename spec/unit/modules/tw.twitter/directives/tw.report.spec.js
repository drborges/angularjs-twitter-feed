describe('twTwitter.directives.twReport', function () {
  var $compile, $scope

  beforeEach(module('twTwitter.directives.twReport', 'twTwitter.templates'))

  beforeEach(inject(function (_$compile_, $rootScope) {
    $compile = _$compile_
    $scope = $rootScope
  }))

  describe('template', function () {

    it('initializes template tweets count with 0', function () {
      var twFeed = $compile('<tw:feed><tw:report></tw:report></tw:feed>')($scope)
      $scope.$digest()

      expect(twFeed.find('.report .tweet-count .count').text()).to.equal('0')
    })

    it('shows "Tracking no terms yet" when trackedTerms is empty', function () {
      var twFeed = $compile('<tw:feed><tw:report></tw:report></tw:feed>')($scope)
      $scope.$digest()

      expect(twFeed.find('.report .tracked-terms .no-terms')).to.not.have.class('ng-hide')
    })

    it('updates template tweets count field when a new tweet is received', function () {
      var twFeed = $compile('<tw:feed><tw:report></tw:report></tw:feed>')($scope)
      $scope.$digest()

      var twFeedApi = twFeed.controller('twFeed')
      twFeedApi.emit('tweet', 'a new tweet')
      // $scope.$digest()

      expect(twFeed.find('.report .tweet-count .count').text()).to.equal('1')
    })

    it('updates template tracking terms field when tracking terms is changed', function () {
      var twFeed = $compile('<tw:feed><tw:report></tw:report></tw:feed>')($scope)
      $scope.$digest()

      var twFeedApi = twFeed.controller('twFeed')
      twFeedApi.emit('track', '#angularjs, #javascript')

      expect(twFeed.find('.report .tracked-terms .terms').text()).to.equal('#angularjs, #javascript')
      expect(twFeed.find('.report .tracked-terms .no-terms')).to.have.class('ng-hide')
    })
  })
})
