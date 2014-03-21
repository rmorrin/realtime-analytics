
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var hbs = require('express-hbs');
var googleapis = require('googleapis');
var googleAuth = require('google-oauth-jwt');

console.log('google api:' + googleapis);

var app = express();

// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views/partials'
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var io = io.listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('test', function (data) {
    console.log(data);
  });

});

// googleAuth.authenticate({
//   // use the email address of the service account, as seen in the API console - string
//   email: 'EMAIL_HERE',
//   // use the PEM file generated from the downloaded .p12 key - string
//   keyFile: 'key.pem',
//   // specify the scopes you wish to access - array
//   scopes: ['https://www.googleapis.com/auth/analytics.readonly']
// }, function(err, token) {

//   console.log(token);
//   var auth = new googleapis.OAuth2Client();

//   auth.setCredentials({
//     access_token: token
//   });

//   googleapis.discover('analytics', 'v3').execute(function(err, client) {
//     var resp = client.analytics.data.realtime
//       .get({ ids: 'PROFILE_HERE', metrics: 'ga:activeVisitors'})
//       .execute(function(err, resp) {
//         console.log('ok');
//         debugger;
//       });
//   });


// });


var auth = new googleapis.auth.JWT(
  'EMAIL_HERE',
  'key.pem',
  'KEY_HERE',
  ['https://www.googleapis.com/auth/analytics.readonly']
);

auth.authorize(function(err, tokens) {

    googleapis.discover('analytics', 'v3').execute(function(err, client) {

      var resp = client.analytics.data.realtime
      .get({ ids: 'PROFILE_HERE', metrics: 'ga:activeVisitors'})
      .withAuthClient(auth)
      .execute(function(err, resp) {
        console.log('ok');
        debugger;
      })

    });

});

