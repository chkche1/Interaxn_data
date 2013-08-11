'use strict';

/* Services */

angular.module('myApp.services', []).
  value('version', '0.1').
  service('sleepDataService', function($http, $log, $q){
      // List all the functions provided by sleepDataService
      this.retrieveData =  function(){
        var getURL = "/app/sample_data/jawbone_2013_s.json";
        return $http.get(getURL).
          success(function(data, status, headers, config){
          $log.log("success!");
        }).
          error(function(data, status, headers, config){
          $log.log("error!!");
        });

        /* for retrieving data from another domain
        return $http.jsonp(getURL, {
          "params": {
            "callback": "JSON_CALLBACK"
          }}).
          then(function (response){
          return response.data;
        }, function(response){$log.log("failure!!!")});*/
    };

  });
