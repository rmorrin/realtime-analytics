
/*
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var hbs = require('express-hbs');
var analytics = require('./lib/analytics');

/*
 * Express setup
 */
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


/*
 * Socket.io setup
 */
var io = io.listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('test', function (data) {
    console.log(data);
  });

});


/*
 * Authorize with google and start polling
 */
analytics.authorize()
.then(function (response) {
  console.log('Polling started');
  fetch();
})
.catch(function (error) {
  console.log(error);
});


/*
 * Helpers
 */
function fetch() {

  analytics.getData()
  .then(function (data) {
    io.sockets.emit('visitors', { visitors: data });
    setTimeout(fetch, 5000);
  })
  .catch(function (err) {
    console.log(err);
  });

}