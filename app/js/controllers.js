'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('SleepCtrl', function($scope, $http, $log, $q, sleepDataService) {
    $scope.test = "testData";

    // this can be refactored to get a SleepData object
    // with more attributes such as light sleep, deep sleep, etc.
    $scope.selectDate = function(date, quality){
      $scope.selectedDate = date;
      $scope.selectedDateSleepQuality = quality;
    };

    var sleepPromise = sleepDataService.retrieveData();
    sleepPromise.then(function(response){
      $log.log("Success", response);
      $log.log(response.data);

            // stacked bar chart

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var graphData = response.data;
    color.domain(d3.keys(graphData[0]).filter(function(key) { return key !== "DATE"; }));
      graphData.forEach(function(d){
        var y0 = 0;
        d.classes = color.domain().map(function(name){
          return {name:name,y0:y0,y1:y0+=parseFloat(d[name])}});
        d.total = d.classes[d.classes.length-1].y1;

       });
  console.log(graphData);
  x.domain(graphData.map(function(d) { return d.DATE; }));
  y.domain([0, d3.max(graphData, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Sleep Duration");

  var state = svg.selectAll(".DATE")
      .data(graphData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.DATE) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.classes; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });




    },
      function (response){
        $log.log("Error", response)});
    $scope.sleepData = sleepPromise;

  })
  .controller('MyCtrl2', [function() {
  }]);
