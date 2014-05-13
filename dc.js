<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='utf-8'>
  <meta content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0' name='viewport'>

  <title>dc.js Experiment</title>

  <script src='d3.js' type='text/javascript'></script>
  <script src='crossfilter.js' type='text/javascript'></script>
  <script src='dc.js' type='text/javascript'></script>
  <script src='jquery-1.9.1.min.js' type='text/javascript'></script>
  <script src='bootstrap.min.js' type='text/javascript'></script>

  <link href='bootstrap.min.css' rel='stylesheet' type='text/css'>
  <link href='dc.css' rel='stylesheet' type='text/css'>

  <style type="text/css"></style>
</head>





<body>


<div class='container' style='font: 12px sans-serif;'>

<div class='row'>						                                   //add:1
<div class='span6' id='dc-magnitude-chart'>
<h4>Events by Magnitude</h4>
</div>
<div class='span6' id='blank'>
<h4>Blank</h4>
</div>
</div>

<div class='row'>
<div class='span12' id='dc-time-chart'>
<h4>Events per hour</h4>
</div>
</div>




<H5>Generated with 
  <a href="http://nickqizhu.github.io/dc.js/">dc.js</a>,
  <a href="http://square.github.io/crossfilter/">crossfilter</a>, 
  <a href="http://d3js.org/">d3.js</a> and 
  <a href="http://twitter.github.io/bootstrap/">bootstrap</a>.
</H5>
<p>Earthquake data via <a href="http://geonet.org.nz">Geonet</a>.</p>

  
  
  
  
  
  
  
  
  
  
  
  
<script>
/**********************************
* Step0: Load data from json file *
**********************************/
// load data from a csv file
d3.csv("quakes.csv", function (data) {

  // format our data
  var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
  
  data.forEach(function(d) { 
    d.dtg   = dtgFormat.parse(d.origintime.substr(0,19)); 
    d.lat   = +d.latitude;
    d.long  = +d.longitude;
    d.mag   = d3.round(+d.magnitude,1);
    d.depth = d3.round(+d.depth,0);
  });

/******************************************************
* Step1: Create the dc.js chart objects & link to div *
******************************************************/

  //var dataTable = dc.dataTable("#dc-table-graph");
  
  var magnitudeChart = dc.barChart("#dc-magnitude-chart");	//add:2

  var timeChart = dc.lineChart("#dc-time-chart");
  
/****************************************
* 	Run the data through crossfilter    *
****************************************/

  var facts = crossfilter(data);  // Gets our 'facts' into crossfilter

/******************************************************
* Create the Dimensions                               *
* A dimension is something to group or filter by.     *
* Crossfilter can filter by exact value, or by range. *
******************************************************/

  // For datatable
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  }); // group or filter by time


var magValue = facts.dimension(function (d) {			
return d.mag;
});								//add:3

var magValueGroupCount = magValue.group()
.reduceCount(function(d) { return d.mag; }) 			// counts, add:4

var volumeByHour = facts.dimension(function(d) {
return d3.time.hour(d.dtg);
}); 

var volumeByHourGroup = volumeByHour.group()
.reduceCount(function(d) { return d.dtg; });

/***************************************
* 	Step4: Create the Visualisations   *
***************************************/

magnitudeChart.width(480)
.height(150)
.margins({top: 10, right: 10, bottom: 20, left: 40})
.dimension(magValue)
.group(magValueGroupCount)
.transitionDuration(500)
.centerBar(true)
.gap(65)
.filter([3, 5])
.x(d3.scale.linear().domain([0.5, 7.5]))
.elasticY(true)
.xAxis().tickFormat();						//add:5

// time graph
timeChart.width(960)
.height(150)
.margins({top: 10, right: 10, bottom: 20, left: 40})
.dimension(volumeByHour)
.group(volumeByHourGroup)
.transitionDuration(500)
.elasticY(true)
.x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)]))
.xAxis();

/****************************
* Step6: Render the Charts  *
****************************/
			
  dc.renderAll();
  
});
  
</script>
    
</body>
</html>
