var config = require('../config/config');
var googleapis = require('googleapis');
var q = require('Q');

var auth = new googleapis.auth.JWT(
  config.email,
  config.keypath,
  config.key,
  config.scopes
);

module.exports = self = {};


self.authorize = function (callback) {

  var deferred = q.defer();

  auth.authorize(function(err, tokens) {
    if (!err) {
      deferred.resolve();
    }
    else {
      deferred.reject(err);
    }
  });

  return deferred.promise;

}

self.getData = function(callback) {

  var deferred = q.defer();

  console.log('Fetching Active Visitors');

  googleapis.discover('analytics', 'v3').execute(function(err, client) {

    var resp = client.analytics.data.realtime
    .get({ids: 'ga:' + config.profile, metrics: 'ga:activeVisitors' })
    .withAuthClient(auth)
    .execute(function(err, resp) {
      if (!err) {
        deferred.resolve(resp.totalsForAllResults['ga:activeVisitors']);
      }
      else {
        deferred.reject(err);
      }

    });

  });

  return deferred.promise;

}