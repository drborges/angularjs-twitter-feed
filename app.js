var path = require('path')
  , express = require('express')
  , SocketIO = require('socket.io')
  , TweetStream = require('node-tweet-stream');

var app = express()
  , staticContentPath = path.join(__dirname, 'public');

app.use('/static', express.static(staticContentPath))
app.engine('html', require('ejs').renderFile);
app.set('views', staticContentPath)

app.get('/', function(req, res){
  res.render('index.html');
});

var server = app.listen(8000)
  , io = SocketIO(server)
  , tw = TweetStream(require('./config.json'));

io.on('connection', function (socket) {
  socket.on('track', function (hashtags) {
    console.log('Tracking the following hashtags:', hashtags);
    tw.track(hashtags);
  });

  socket.on('untrack', function (hashtags) {
    tw.untrack(hashtags);
  });

  tw.on('tweet', function(tweet) {
    console.log('new tweet!')
    socket.emit('tweet', tweet);
  });
});
