$(function () {
    $(document).ready(function() {
	var donnee;
	var height= 175000;
	var sorted_collection = {};
	
	$.getJSON("/assets/json/histogram_gdac.json", function(data) {
		var series = [];
		var series_all_axes = [];
		//Tri des données
		sorted_collection = sortCollection(data.GDAC);
		//Création des séries
		$.each(sorted_collection,function(index, value) {
			series.push({
			    name: index,
			    data: value,
			    //shadow : true,
			    color: data.COLOR[index]
			});
	    	});
		series_all_axes = series.slice();
		$.each(data.FLOATS,function(index, value) {
			series_all_axes.push({
				name: index,
				data: value,
				color: '#0BB825',
				yAxis:1,
				//shadow : true,
				type:'spline'
			});
	    	});
		//Mise en place des graphiques
		if ($("#Histogram").length > 0){
			chart_column = new Highcharts.Chart({
				chart: {
					renderTo: 'Histogram',
					type: 'column',
					//plotShadow: true,
					height: 400,
					zoomType: 'y'
				},
				title: {
				    text: 'Histogram of profiles on Argo GDAC'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				xAxis: {
				    categories: data.YEARS
				},
				yAxis: [
				    {//1er axe
					alignTicks: false,
					title: {
					    text: 'Number of profiles collected'
					}
				    },
				   { //2eme axe
					min: 0,
					alignTicks: false,
					gridLineWidth: 0,
					title: {
					    text: 'Number of active floats',
					    style: {
						color: '#4572A7'
					    }
					},
					opposite: true
				    }
				],
				plotOptions: {
				    series: {
					stacking: 'normal'
				    }
				},
				series: series_all_axes,
		    	});
		}
		//Même graphique mais en %
		if ($("#Histogram_percent").length > 0){
			chart_column = new Highcharts.Chart({
				chart: {
					renderTo: 'Histogram_percent',
					type: 'column',
					plotShadow: true,
					height: 400,
					zoomType: 'y'
				},
				title: {
				    text: 'Histogram of profiles on Argo GDAC (%)'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} profiles)<br/>',
					shared: true
				},
				xAxis: {
				    categories: data.YEARS
				},
				yAxis: [
				    {//1er axe
					//alignTicks: false,
					title: {
					    text: 'Percentage of profiles collected'
					}
				    }
				],
				plotOptions: {
				    series: {
					stacking: 'percent'
				    }
				},
				series: series,
		    	});
		}
	});

	$.getJSON("/assets/json/histogram_gdac_delayed.json", function(data) {
		var series = [];
		var series_available = [];
		var delayed_values = [];
		var real_time_values = [];
		var real_time_available_values = [];
		var delayed_available_values = [];
		//Tri des données
		sorted_collection = sortCollection(data.UNAVAILABLE_VALUES);
		$.each(sorted_collection,function(index, value) {
			    delayed_values.push(value[0]);
			    real_time_values.push(value[1]);
		});
		sorted_collection = sortCollection(data.AVAILABLE_VALUES);
		$.each(sorted_collection,function(index, value) {
			    delayed_available_values.push(value[0]);
			    real_time_available_values.push(value[1]);
		});

		series.push({
			name: 'Delayed mode profiles',
			data: delayed_values,
			color: '#00BFFF',
			shadow : true
	    	});
		//Création des séries
		series.push({
			name: 'Real-time profiles',
			data: real_time_values,
			color: '#32CD32',
			shadow : true,
	    	});
		series_available.push({
			name: 'Delayed available profiles',
			data: delayed_available_values,
			color: '#00BFFF',
			shadow : true,
	    	});
		series_available.push({
			name: 'Real-time available profiles',
			data: real_time_available_values,
			color: '#32CD32',
			shadow : true,
	    	});
		//Mise en place des graphiques
		if ($("#Histogram_delayed").length > 0){
		chart_column = new Highcharts.Chart({
					chart: {
					renderTo: 'Histogram_delayed',
					type: 'column',
					plotShadow: true,
					height: 400,
					zoomType: 'y'
				},
				title: {
				    text: 'Histogram of delayed mode profiles on Argo GDAC'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				xAxis: {
				    categories: data.GDAC.sort().reverse()
				},
				yAxis: {
					title: {
					    text: 'Number of profiles'
					}
				},
				plotOptions: {
				    series: {
					stacking: 'normal'
				    }
				},
				series: series,
		    	});
		}

		if ($("#Histogram_delayed_percent").length > 0){
		chart_column = new Highcharts.Chart({
					chart: {
					renderTo: 'Histogram_delayed_percent',
					type: 'column',
					//plotShadow: true,
					height: 400,
					zoomType: 'y'
				},
				title: {
				    text: 'Histogram of delayed profiles on Argo GDAC (%)'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				xAxis: {
				    categories: data.GDAC.sort().reverse()
				},
				yAxis: {
					alignTicks: false,
					title: {
					    text: 'Percentage of profiles'
					}
				},
				tooltip: {
					pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} profiles)<br/>',
					shared: true
				},
				plotOptions: {
				    column: {
					stacking: 'percent'
				    },
				    series: {
					stacking: 'percent'
				    }
				},
				series: series,
				
		    	});
		}

		if ($("#Histogram_delayed_available").length > 0){
		chart_column = new Highcharts.Chart({
					chart: {
					renderTo: 'Histogram_delayed_available',
					type: 'column',
					plotShadow: true,
					height: 400,
					zoomType: 'y'
				},
				title: {
				    text: 'Histogram of profiles available for delayed mode on Argo GDAC'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				xAxis: {
				    categories: data.GDAC.sort().reverse()
				},
				yAxis: {
					title: {
					    text: 'Number of profiles'
					}
				},
				plotOptions: {
				    series: {
					stacking: 'normal'
				    }
				},
				series: series_available,
		    	});
		}
	});

	$.getJSON("/assets/json/platform_pie.json", function(data) {
		var donnee = [];
		if ($("#active_pie_graph").length > 0){
			//Tri des données
			sorted_collection = sortCollection(data.ACTIVE.GDAC);
			//Création des séries
			$.each(sorted_collection,function(index, value) {
				donnee.push({
				    name: index,
				    y: (value*100)/data.ACTIVE.TOTAL,
				    color: data.COLOR[index],
				    shadow : true
				});
		    	});
			chart_pie = new Highcharts.Chart({
				chart: {
					renderTo: 'active_pie_graph',
					plotShadow: false,
					height: 400
				},
				title: {
				    text: data.ACTIVE.TOTAL+' active floats on Argo GDAC'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				tooltip: {
		            formatter: function() {
		                return '<b>Number of '+this.point.name+' platform</b>: '+ data.ACTIVE.GDAC[this.point.name];
		            }
		        },
				plotOptions: {
			    		pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
						    enabled: true,
						    color: '#000000',
						    connectorColor: '#000000',
						    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						}
			    		}
				},
				series: [{
		   			type: 'pie',
		    			name: 'Platform Number',
					shadow : true,
					data: donnee
				}]
		    	});

		}else if($("#pie_graph").length > 0){
			//Tri des données
			sorted_collection = sortCollection(data.ALL.GDAC);
			//Création des séries
			$.each(sorted_collection,function(index, value) {
				donnee.push({
				    name: index,
				    y: (value*100)/data.ALL.TOTAL,
				    color: data.COLOR[index],
				});
		    	});
			chart_pie = new Highcharts.Chart({
				chart: {
					renderTo: 'pie_graph',
					plotShadow: false,
					height: 400
				},
				title: {
				    text: data.ALL.TOTAL+' floats on Argo GDAC'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				tooltip: {
		            formatter: function() {
		                return '<b>Number of '+this.point.name+' platform</b>: '+ data.ALL.GDAC[this.point.name];
		            }
		        },
				plotOptions: {
			    		pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
						    enabled: true,
						    color: '#000000',
						    connectorColor: '#000000',
						    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						}
			    		}
				},
				series: [{
		   			type: 'pie',
		    			name: 'Platform Number',
					shadow : true,
					data: donnee
				}]
		    	});
		}else{
			//Tri des données
			sorted_collection = sortCollection(data.DELAYED.GDAC);
			//Création des séries
			$.each(sorted_collection,function(index, value) {
				donnee.push({
				    name: index,
				    y: (value*100)/data.DELAYED.TOTAL,
				    color: data.COLOR[index],
				});
		    	});
			chart_pie = new Highcharts.Chart({
				chart: {
					renderTo: 'delayed_pie_graph',
					plotShadow: false,
					height: 400
				},
				title: {
				    text: data.DELAYED.TOTAL+' delayed mode profiles on Argo GDAC'
				},
				subtitle: {
				    text: '(C) Coriolis data center - '+data.DATE
				},
				tooltip: {
		            formatter: function() {
		                return '<b>Number of '+this.point.name+' platform</b>: '+ data.DELAYED.GDAC[this.point.name];
		            }
		        },
				plotOptions: {
			    		pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
						    enabled: true,
						    color: '#000000',
						    connectorColor: '#000000',
						    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
						}
			    		}
				},
				series: [{
		   			type: 'pie',
		    			name: 'Platform Number',
					shadow : true,
					data: donnee
				}]
		    	});
		}
	});
   });
});

/*
*
* Cette fonction trie une collection dans l'ordre inversement alphabétique.
*	$paramètres : Collection.
*	$Return : Collection triée.
*
*/
function sortCollection(data)
{
	var keys = [];
    	var sorted_collection = {};

    	for(var key in data){
		if(data.hasOwnProperty(key)){
		    keys.push(key);
		}
    	}

    	// sort keys
    	keys.sort();
	keys.reverse(); 
	// create new delayed_values based on Sorted Keys
	jQuery.each(keys, function(i, key){
		sorted_collection[key] = data[key];
	});

	return sorted_collection;
}
