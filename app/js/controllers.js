'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('SleepCtrl', function($scope, $http, $log, $q, sleepDataService) {
    $scope.test = "testData";

    var sleepPromise = sleepDataService.retrieveData();
    sleepPromise.then(function(response){
        $log.log("Success", response);}, 
      function (response){
        $log.log("Error", response)});
    $scope.sleepData = sleepPromise;


  })
  .controller('MyCtrl2', [function() {
  }]);
