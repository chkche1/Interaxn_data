'use strict';

/* Directives */

angular.module('myApp.directives', []).
directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

// Stacked bar chart directive
// requires D3.js
// Created Aug 17, 2013 by Benjamin Shyong
// hello@benshyong.com
//  DIRECTIVE OPTIONS
//    width: the width of the chart
//    height: the height of the chart
//    barPadding: amount of padding between bars
//    yfields: field names for y-axis data
//    xfield: field name for x-axis data
//    data: data source
angular.module('myApp.directives', [])
  .directive('d3StackedBarChart', [function(){
    var directiveDefinitionObject = {
      restrict: 'E',
      // set up isolated scope
      // '@' binds a local scope property to the value of DOM attribute
      // '=' sets up bi-directional binding between a local scope property
      //    and the parent scope property of name defined via the value of
      //    the attr attribute.
      // '&' provides a way to execute an expression in
      //    the context of the parent scope.
      scope: {
        width: '@',
        height: '@',
        barPadding: '@',
        yfields: '@',
        xfield: '@',
        data: '=',
        onClick: '&'
      },
      link: function(scope, element, attrs){
        scope.$watch('data', function(data){
          if(data){
            var legendWidth = 100;
            var width = scope.width || 500;
            var height = scope.height || 200;
            var barPadding = scope.barPadding || 0.051;
            var fieldNames = scope.yfields.match(/(?=\S)[^,]+?(?=\s*(,|$))/g);
            var xAxisField = scope.xfield;
            var stackData = [];

            // transform data for d3 stack layout
            // and set x values array
            var xValues = [];

            for (var i = 0;i<fieldNames.length;i++){
              stackData.push({
                name: fieldNames[i],
                values: data.map(function(d){
                  xValues.push(d[xAxisField]);
                  return {
                    x: d[xAxisField],
                    y: +d[fieldNames[i]]
                  };
                })
              });
            }

            // stack the data
            d3.layout.stack().values(function(d) {return d.values;})(stackData);

            // set x-axis scale
            var xScale = d3.scale.ordinal()
                                 .domain(xValues)
                                 .rangeRoundBands([0, width], barPadding);

            // set y-axis scale
            var yScale = d3.scale.linear()
                                 .domain([0, d3.max(stackData, function(d){
                                  return d3.max(d.values, function(d){
                                      return d.y0 + d.y;
                                    });
                                  })
                                 ])
                                 .range([0,height]);

            // set colors (10 unique colors)
            var colors = d3.scale.category10();

            // create SVG
            var svg = d3.select(element[0])
                        .html('')
                        .append("svg")
                        .attr('preserveAspectRatio', 'xMinYMin')
                        .attr("width", width+legendWidth)
                        .attr("height", height);

            // add groups for each y-axis field
            var groups = svg.selectAll("g")
                            .data(stackData)
                            .enter()
                            .append("g")
                            .style("fill", function(d,i){
                              return colors(i);
                            })
                            .attr("name", function(d){
                              return d.name;
                            });
            // add bars for each group
            var rects = groups.selectAll("rect")
                              .data(function(d){
                                return d.values;
                              })
                              .enter()
                              .append("rect")
                              .attr("x", function(d,i){
                                return xScale(i);
                              })
                              .attr("y", function(d){
                                return height-yScale(d.y0 + d.y);
                              })
                              .attr("height", function(d){
                                return yScale(d.y);
                              })
                              .attr("width", xScale.rangeBand());

          // add groups for legend
          var legend = svg.selectAll(".legend")
              .data(stackData)
              .enter()
              .append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width+legendWidth - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d,i){
                return colors(i);
              });

          legend.append("text")
              .attr("x", width+legendWidth - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d.name; });

          }
          else{
            d3.select(element[0]).append("b").text("No Data!");
          }
        });
      }
    };
    return directiveDefinitionObject;
  }]);

// angular.module('myApp.directives', [])
// .directive('d3AreaGraph', [function() {
//   'use strict';

//   return {
//     restrict: 'E',

//             // set up the isolate scope so that we don't clobber parent scope
//             scope: {
//               onClick:     '=',
//               width:       '=',
//               height:      '=',
//               bind:        '=',
//               label:       '@',
//               field:       '@',
//               duration:    '@',
//               delay:       '@',
//               plot:        '@',
//               pointRadius: '@',
//               xfield: '@',
//               yfield: '@'
//             },

//             link: function(scope, element, attrs) {

//               var margin = {
//                 top: 20,
//                 right: 20,
//                 bottom: 30,
//                 left: 80
//               };
//                 // default width/height - mainly to create initial aspect ratio
//                 var width = scope.width || 1280;
//                 var height = scope.height || 300;

//                 // are we using interpolation
//                 var interpolate = attrs.interpolate || 'false';

//                 var label = attrs.label || 'Frequency';
//                 var klass = attrs.class || '';

//                 // add margins (make room for x,y labels)
//                 width = width - margin.left - margin.right;
//                 height = height - margin.top - margin.bottom;

//                 // create x,y sclaes (x is inferred as time)
//                 var x = d3.time.scale()
//                 .range([0, width]);

//                 var y = d3.scale.linear()
//                 .range([height, 0]);

//                 // create x,y axis
//                 var xAxis = d3.svg.axis()
//                 .scale(x)
//                 .orient('bottom');

//                 var yAxis = d3.svg.axis()
//                 .scale(y)
//                 .orient('left');

//                 // create line generator
//                 var line = d3.svg.line()
//                 .x(function(d) { return x(new Date(d[scope.xfield].slice(0,4), d[scope.xfield].slice(4,6), d[scope.xfield].slice(6,8)).getTime()); })
//                 .y(function(d) { return y(d[scope.yfield]); });

//                 // create area generator
//                 var area = d3.svg.area()
//                 .x(function(d) { return x(new Date(d[scope.xfield].slice(0,4), d[scope.xfield].slice(4,6), d[scope.xfield].slice(6,8)).getTime()); })
//                 .y0(height)
//                 .y1(function(d) { return y(d[scope.yfield]); });

//                 // enable interpolation if specified
//                 if (attrs.interpolate == 'true') {
//                   line.interpolate('cardinal');
//                   area.interpolate('cardinal');
//                 }

//                 // create the root SVG node
//                 var svg = d3.select(element[0])
//                 .append('svg')
//                 .attr('preserveAspectRatio', 'xMinYMin')
//                 .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
//                 .append('g')
//                 .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//                 // generate the area. Data is empty at link time
//                 svg.append('path')
//                 .datum([])
//                 .attr('class', 'area fill ' + klass)
//                 .attr('d', area);

//                 // insert the x axis (no data yet)
//                 svg.append('g')
//                 .attr('class', 'area x axis ' + klass)
//                 .attr('transform', 'translate(0,' + height + ')')
//                 .call(xAxis);

//                 // insert the y axis (no data yet)
//                 svg.append('g')
//                 .attr('class', 'area y axis ' + klass)
//                 .call(yAxis)
//                 .append('text')
//                 .attr('transform', 'rotate(-90)')
//                 .attr('y', 6)
//                 .attr('dy', '.71em')
//                 .style('text-anchor', 'end')
//                 .text(label);

//                 // generate the line. Data is empty at link time
//                 svg.append('path')
//                 .datum([])
//                 .attr('class', 'area line ' + klass)
//                 .attr("d", line);


//                 // main observer fn called when scope is updated. Data and scope vars are now bound
//                 scope.$watch('bind', function(data) {

//                     // pull info from scope
//                     var duration = scope.duration || 0;
//                     var delay = scope.delay || 0;
//                     var dataPoints = scope.plot || 'true';
//                     var pointRadius = scope.pointRadius || 8;
//                     var field = scope.field || attrs.bind.split('.').pop().toLowerCase();

//                     // just because scope is bound doesn't imply we have data.
//                     if (data) {

//                         // pull the data array from the facet
//                         data = data || [];

//                         // use that data to build valid x,y ranges
//                         // d3.extent(array[, accessor])
//                         // Returns the minimum and maximum value in the given array using natural order.
//                         // This is equivalent to calling d3.min and d3.max simultaneously.
//                         x.domain(d3.extent(data, function(d) { return new Date(d[scope.xfield].slice(0,4), d[scope.xfield].slice(4,6), d[scope.xfield].slice(6,8)).getTime(); }));
//                         y.domain([0, d3.max(data, function(d) { return d[scope.yfield]; })]);

//                         // create the transition
//                         var t = svg.transition().duration(duration);

//                         // feed the current data to our area/line generators
//                         t.select('.area').attr('d', area(data));
//                         t.select('.line').attr('d', line(data));

//                         // does the user want data points to be plotted
//                         if (dataPoints == 'true') {

//                             // create svg circle for each data point
//                             // using Math.random as (optional) key fn ensures old
//                             // data values are flushed and all new values inserted
//                             var points = svg.selectAll('circle')
//                             .data(data.filter(function(d) {
//                               return d[scope.yfield];
//                             }), function(d) {
//                               return Math.random();
//                             });

//                             // d3 enter fn binds each new value to a circle
//                             points.enter()
//                             .append('circle')
//                             .attr('class', 'area line points ' + klass)
//                             .attr('cursor', 'pointer')
//                             .attr("cx", line.x())
//                             .attr("cy", line.y())
//                             .style("opacity", 0)
//                             .transition()
//                             .duration(duration)
//                             .style("opacity", 1)
//                             .attr("cx", line.x())
//                             .attr("cy", line.y())
//                             .attr("r", pointRadius);

//                             // wire up any events (registers filter callback)
//                             points.on('mousedown', function(d) {
//                               scope.$apply(function() {
//                                 (scope.onClick || angular.noop)(new Date(d[scope.xfield].slice(0,4), d[scope.xfield].slice(4,6), d[scope.xfield].slice(6,8)), d[scope.yfield]);
//                               });
//                             });

//                             // d3 exit/remove flushes old values (removes old circles)
//                             points.exit().remove();
//                           }

//                         // update our x,y axis based on new data values
//                         t.select('.x').call(xAxis);
//                         t.select('.y').call(yAxis);

//                       }
//                     })
// }
// };
// }]);