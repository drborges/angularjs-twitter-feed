describe('twTwitter.directives.twFeed', function () {
  var $compile, $scope, TwitterFeed

  beforeEach(module('twTwitter.directives.twFeed', 'twTwitter.templates'))

  beforeEach(inject(function (_$compile_, $rootScope, _TwitterFeed_) {
    $compile = _$compile_
    $scope = $rootScope
    TwitterFeed = _TwitterFeed_

    TwitterFeed.on = sinon.spy()
    TwitterFeed.untrack = sinon.spy()
    TwitterFeed.simulateReceive = function (/* tweets */) {
      var tweets = Array.prototype.slice.call(arguments);
      var tweetReceivedCallback = this.on.args[0][1]
      tweets.forEach(function (tweet) {
        tweetReceivedCallback(tweet)
      })
    }
  }))

  describe('compiling + linking', function () {

    it('tracks tweets with provided hashtags', function () {
      var template = '<tw:feed track="angularjs"></tw:feed>'

      var element = $compile(template)($scope)
      $scope.$digest()

      var api = element.controller('twFeed')
      expect(TwitterFeed.on).to.have.been.calledWithExactly("angularjs", api.receive)
    })

    it('tracks new set of hashtags whenever tracking terms is changed', function () {
      var element = $compile('<tw:feed></tw:feed>')($scope)
      $scope.$digest()

      element.isolateScope().trackingTerms = '#angularjs, #poa'
      $scope.$digest()

      var api = element.controller('twFeed')
      expect(TwitterFeed.on).to.have.been.calledWithExactly('#angularjs, #poa', api.receive)
    })

    it('untracks previous tracking terms before tracking new ones', function () {
      var element = $compile('<tw:feed track="currentTrackedTerm"></tw:feed>')($scope)
      $scope.$digest()

      element.isolateScope().trackingTerms = '#angularjs'
      $scope.$digest()

      var api = element.controller('twFeed')
      expect(TwitterFeed.untrack).to.have.been.calledWithExactly('currentTrackedTerm')
      expect(TwitterFeed.untrack).to.have.been.calledBefore(TwitterFeed.on)
    })
  })

  describe('API', function () {

    describe('#track', function () {

      it('registers the hashtags to be tracked', function () {
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var hashtags = 'JavaScript, AngularJS'
        var api = element.controller('twFeed')

        api.track(hashtags)
        expect(TwitterFeed.on).to.have.been.calledWithExactly(hashtags, api.receive)
      })

      it('does not register empty hashtags', function () {
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var api = element.controller('twFeed')

        api.track('')
        expect(TwitterFeed.on).to.not.have.been.called
      })

      it('notifies listeners', function () {
        var listener = sinon.spy()
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var api = element.controller('twFeed')

        api.on('track', listener)
        api.track('#angularjs')
        expect(listener).to.have.been.calledWith('#angularjs')
      })
    })

    describe('#untrack', function () {

      it('unregisters the hashtags being tracked', function () {
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var hashtags = 'JavaScript, AngularJS'
        var api = element.controller('twFeed')

        api.untrack(hashtags)
        expect(TwitterFeed.untrack).to.have.been.calledWithExactly(hashtags)
      })

      it('does not attempt to unregister empty hashtags', function () {
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var api = element.controller('twFeed')

        api.untrack('')
        expect(TwitterFeed.untrack).to.not.have.been.called
      })

      it('notifies listeners', function () {
        var listener = sinon.spy()
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var api = element.controller('twFeed')

        api.on('untrack', listener)
        api.untrack('#angularjs')
        expect(listener).to.have.been.calledWith('#angularjs')
      })
    })

    describe('#receive', function () {

      it('updates tweets adding new tweet to the head of the list', function () {
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        element.controller('twFeed').receive('a tweet')

        expect(element.isolateScope().tweets).to.contain('a tweet')

        element.controller('twFeed').receive('another tweet')

        expect(element.isolateScope().tweets[0]).to.equal('another tweet')
        expect(element.isolateScope().tweets[1]).to.equal('a tweet')
      })

      it('notifies watchers when updating tweets list', function () {
        var element = $compile('<tw:feed></tw:feed>')($scope)
        $scope.$digest()

        var tweets = [];
        element.isolateScope().$watch('tweets', function (updatedTweetsList) {
          tweets = updatedTweetsList
        })

        expect(tweets).to.be.empty
        element.controller('twFeed').receive('a tweet')
        expect(tweets).to.include('a tweet')
      })

      it('notifies listeners when a new tweet is received', function () {
        var element = $compile('<tw:feed><tw:feed>')($scope)
        $scope.$digest()

        var listenerA = sinon.spy()
        var listenerB = sinon.spy()
        var api = element.controller('twFeed')

        api.on('tweet', listenerA)
        api.on('tweet', listenerB)

        api.receive('a tweet')

        expect(listenerA).to.have.been.calledWith('a tweet')
        expect(listenerB).to.have.been.calledWith('a tweet')
      })
    })
  })

  describe('template', function () {
    var aTweet = {
      user: {
        profile_image_url: 'http://image.url.com',
        name: 'user name',
        screen_name: 'user screen name'
      },
      text: 'the tweet text'
    }

    it('adds new tweet information to the list', function () {
      var element = $compile('<tw:feed track="JavaScript, AngularJS"></tw:feed>')($scope)
      $scope.$digest()

      TwitterFeed.simulateReceive('A tweet', 'Another tweet')

      expect(element.find('.tweets .tweet').length).to.equal(2)
    })

    it('shows the user avatar', function () {
      var element = $compile('<tw:feed track="#AngularJS"></tw:feed>')($scope)
      $scope.$digest()

      TwitterFeed.simulateReceive(aTweet)

      expect(element.find('.tweet .avatar').attr('src')).to.equal(aTweet.user.profile_image_url)
    })

    it('shows the user name', function () {
      var element = $compile('<tw:feed track="#AngularJS"></tw:feed>')($scope)
      $scope.$digest()

      TwitterFeed.simulateReceive(aTweet)

      expect(element.find('.tweet .user .name').text()).to.equal(aTweet.user.name)
    })

    it('shows the user login', function () {
      var element = $compile('<tw:feed track="#AngularJS"></tw:feed>')($scope)
      $scope.$digest()

      TwitterFeed.simulateReceive(aTweet)

      expect(element.find('.tweet .user .login').text()).to.equal('@' + aTweet.user.screen_name)
    })

    it('shows the tweet text', function () {
      var element = $compile('<tw:feed track="#AngularJS"></tw:feed>')($scope)
      $scope.$digest()

      TwitterFeed.simulateReceive(aTweet)

      expect(element.find('.tweet .text').text()).to.equal(aTweet.text)
    })
  })
})
