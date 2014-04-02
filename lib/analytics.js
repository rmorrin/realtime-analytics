var config = require('../config/config');
var googleapis = require('googleapis');

var auth = new googleapis.auth.JWT(
  config.email,
  config.keypath,
  config.key,
  config.scopes
);

module.exports = self = {};


self.authorize = function (callback) {

  auth.authorize(function(err, tokens) {
    if (!err) {
      callback(auth);
    }
  });

}

self.getData = function(callback) {

  console.log('Fetching Active Visitors');

  googleapis.discover('analytics', 'v3').execute(function(err, client) {

    var resp = client.analytics.data.realtime
    .get({ids: 'ga:' + config.profile, metrics: 'ga:activeVisitors' })
    .withAuthClient(auth)
    .execute(function(err, resp) {

      if (!err) {
        //console.log('Visitors: ' + resp.totalsForAllResults['ga:activeVisitors']);
        if (callback) {
          callback(resp.totalsForAllResults['ga:activeVisitors']);
        }
      }

    });

  });

}