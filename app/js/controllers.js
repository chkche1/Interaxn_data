'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('SleepCtrl', function($scope, $http, $log, $q, sleepDataService) {
    $scope.test = "testData";

    var sleepPromise = sleepDataService.retrieveData();
    sleepPromise.then(function(response){
      $log.log("Success", response);
      $log.log(response.data);
    },
      function (response){
        $log.log("Error", response)
    });
    $scope.sleepData = sleepPromise;

    // this can be refactored to get a SleepData object
    // with more attributes such as light sleep, deep sleep, etc.
    $scope.selectDate = function(date){
      $scope.selectedDate = date;
    };

  })
  .controller('MyCtrl2', [function() {
  }]);
