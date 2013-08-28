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
        $log.log("Error", response);
    });
    $scope.sleepData = sleepPromise;

    // this can be refactored to get a SleepData object
    // with more attributes such as light sleep, deep sleep, etc.
    $scope.selectDate = function(date){
      $scope.selectedDate = date;
    };

    $scope.fetchBasisBenData = function(){
      var basisBen = [];
      for (var m = moment('2013-03-29'); m.isBefore(moment('2013-06-27')); m.add('days', 1)) {
        sleepDataService.retrieveData("/app/sample_data/basis_ben/" + m.format('YYYY-MM-DD') + ".json").then(function(response){
          basisBen.push(response.data);
        });
      }
      $scope.basisBenData = basisBen;
    }

  })
  .controller('MyCtrl2', [function() {
  }]);
