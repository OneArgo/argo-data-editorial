$(function () {
	$(document).ready(function () {
		var donnee;
		var height = 175000;
		var sorted_collection = {};

		$.getJSON("assets/json/platform_pie.json", function (data) {
			var donnee = [];
			if ($("#pie_active").length > 0) {
				//Tri des données
				sorted_collection = sortCollection(data.ACTIVE.GDAC);
				//Création des séries
				$.each(sorted_collection, function (index, value) {
					donnee.push({
						name: index,
						y: (value * 100) / data.ACTIVE.TOTAL,
						color: data.COLOR[index],
						shadow: true
					});
				});
				chart_pie = new Highcharts.Chart({
					chart: {
						renderTo: 'pie_active',
						plotShadow: false,
						height: 400
					},
					title: {
						text: data.ACTIVE.TOTAL + ' active floats on Argo GDAC'
					},
					subtitle: {
						text: '(C) Coriolis data center - ' + data.DATE
					},
					tooltip: {
						formatter: function () {
							return '<b>Number of ' + this.point.name + ' platform</b>: ' + data.ACTIVE.GDAC[this.point.name];
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
						shadow: true,
						data: donnee
					}]
				});

			} else if ($("#pie_graph").length > 0) {
				//Tri des données
				sorted_collection = sortCollection(data.ALL.GDAC);
				//Création des séries
				$.each(sorted_collection, function (index, value) {
					donnee.push({
						name: index,
						y: (value * 100) / data.ALL.TOTAL,
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
						text: data.ALL.TOTAL + ' floats on Argo GDAC'
					},
					subtitle: {
						text: '(C) Coriolis data center - ' + data.DATE
					},
					tooltip: {
						formatter: function () {
							return '<b>Number of ' + this.point.name + ' platform</b>: ' + data.ALL.GDAC[this.point.name];
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
						shadow: true,
						data: donnee
					}]
				});
			} else {
				//Tri des données
				sorted_collection = sortCollection(data.DELAYED.GDAC);
				//Création des séries
				$.each(sorted_collection, function (index, value) {
					donnee.push({
						name: index,
						y: (value * 100) / data.DELAYED.TOTAL,
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
						text: data.DELAYED.TOTAL + ' delayed mode profiles on Argo GDAC'
					},
					subtitle: {
						text: '(C) Coriolis data center - ' + data.DATE
					},
					tooltip: {
						formatter: function () {
							return '<b>Number of ' + this.point.name + ' platform</b>: ' + data.DELAYED.GDAC[this.point.name];
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
						shadow: true,
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
function sortCollection(data) {
	var keys = [];
	var sorted_collection = {};

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			keys.push(key);
		}
	}

	// sort keys
	keys.sort();
	keys.reverse();
	// create new delayed_values based on Sorted Keys
	jQuery.each(keys, function (i, key) {
		sorted_collection[key] = data[key];
	});

	return sorted_collection;
}
