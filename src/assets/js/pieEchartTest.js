$(function () {
	$(document).ready(function () {
		var sorted_collection = {};

		$.getJSON("https://co.ifremer.fr/co/co040702/co-argoGdac/json/platform_pie.json", function (data) {
			if ($("#pie_active").length > 0) {
				// Tri des données
				sorted_collection = sortCollection(data.ACTIVE.GDAC);

				// Préparation des données pour ECharts
				var echartsData = [];
				$.each(sorted_collection, function (index, value) {
					echartsData.push({
						name: index,
						value: value,
						itemStyle: {
							color: data.COLOR[index]
						}
					});
				});

				// Initialisation du graphique ECharts
				var chartDom = document.getElementById('pie_active');
				var myChart = echarts.init(chartDom);

				var option = {
					title: {
						text: data.ACTIVE.TOTAL + ' active floats on Argo GDAC',
						subtext: '(C) Coriolis data center - ' + data.DATE,
						left: 'center',
						top: 10
					},
					tooltip: {
						trigger: 'item',
						formatter: function (params) {
							return '<b>Number of ' + params.name + ' platform</b>: ' + data.ACTIVE.GDAC[params.name];
						}
					},
					// legend: {
					// 	orient: 'vertical',
					// 	left: 'left',
					// 	data: Object.keys(data.ACTIVE.GDAC)
					// },
					series: [
						{
							name: 'Platform Number',
							type: 'pie',
							radius: '60%',
							data: echartsData,
							label: {
								formatter: '{b}: {d}%'
							},
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				};
				myChart.setOption(option);
			}

			if ($("#pie_all").length > 0) {
				// Tri des données pour "all"
				sorted_collection = sortCollection(data.ALL.GDAC);

				// Préparation des données pour ECharts
				var echartsData = [];
				$.each(sorted_collection, function (index, value) {
					echartsData.push({
						name: index,
						value: value,
						itemStyle: {
							color: data.COLOR[index]
						}
					});
				});

				// Initialisation du graphique ECharts
				var chartDom = document.getElementById('pie_all');
				var myChart = echarts.init(chartDom);

				var option = {
					title: {
						text: data.ALL.TOTAL + ' floats on Argo GDAC',
						subtext: '(C) Coriolis data center - ' + data.DATE,
						left: 'center',
						top: 10
					},
					tooltip: {
						trigger: 'item',
						formatter: function (params) {
							return '<b>Number of ' + params.name + ' platform</b>: ' + data.ALL.GDAC[params.name];
						}
					},
					series: [
						{
							name: 'Platform Number',
							type: 'pie',
							radius: '60%',
							data: echartsData,
							label: {
								formatter: '{b}: {d}%'
							},
							emphasis: {
								itemStyle: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				};

				myChart.setOption(option);
			} else {
				console.error("Element with id 'pie_*' not found.");
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
	// Convertit l'objet en tableau de paires [clé, valeur]
	var items = Object.entries(data);

	// Trie le tableau par valeur décroissante
	items.sort(function (a, b) {
		return b[1] - a[1];
	});

	// Recrée un objet trié
	var sorted_collection = {};
	items.forEach(function (item) {
		sorted_collection[item[0]] = item[1];
	});

	return sorted_collection;
}
