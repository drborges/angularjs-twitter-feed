# Angular Twitter Feed

This is the codebase used during the AngularJS meet up on the Sep 29th 2014 at Porto Alegre - Brazil

It implements a simple tweet feed tracker directive using node-tweet-stream.

# Directive Usage

```html
<tw-feed track="#AngularJS #POA #MeetUp"></tw-feed>
```

Adding report support:

```html
<tw-feed track="#AngularJS #POA #MeetUp">
  <tw-report></tw-report>
</tw-feed>
```

# Running the Sample App

1. This application uses Twitter app authentication API, so you'll need a `config.json` on the application root (side-by-side with app.js) as follows:

```javascript
{
  "consumer_key": "your consuner key",
  "consumer_secret": "your consumer secret key",
  "token": "your token",
  "token_secret": "your token secret"
}
```

**For more information on how to create a Twitter app and have access to the information above, check out [this post](http://www.dototot.com/how-to-write-a-twitter-bot-with-python-and-tweepy/)**

2. Then, fetch the dependencies and start the app:

```bash
$ bower install
$ npm install
$ gulp
```

### Running The Tests

Running the unit tests once:

`$ gulp spec`

### Activating TDD Mode

In order to have all your tests run on every code change use:

`$ gulp tdd`

### Activating The Browser Livereload

In order to have your changes immediately refreshed onto the broser run:

`$ gulp livereload`

