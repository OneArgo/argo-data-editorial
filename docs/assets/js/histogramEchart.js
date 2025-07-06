$(function () {
    $(document).ready(function () {
        $.getJSON("assets/json/histogram_gdac.json", function (data) {
            // Tri des données
            var sorted_collection = sortCollection(data.GDAC);

            // Préparation des séries pour ECharts
            var echartsSeries = [];
            $.each(sorted_collection, function (index, value) {
                echartsSeries.push({
                    name: index,
                    type: 'bar',
                    stack: 'profiles', // <-- Ajout pour empiler
                    data: value,
                    itemStyle: { color: data.COLOR[index] }
                });
            });

            // Ajout des FLOATS (axe secondaire, type ligne)
            $.each(data.FLOATS, function (index, value) {
                echartsSeries.push({
                    name: index,
                    type: 'line',
                    yAxisIndex: 1,
                    data: value,
                    itemStyle: { color: '#0BB825' }
                });
            });
            if ($("#Histogram").length > 0) {

                // Initialisation du graphique ECharts
                var chartDom = document.getElementById('Histogram');
                var myChart = echarts.init(chartDom);

                var option = {
                    title: {
                        text: 'Histogram of profiles on Argo GDAC'
                    },
                    subtitle: {
                        text: '(C) Coriolis data center - ' + data.DATE,
                        left: 'center',
                        top: 30
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: Object.keys(sorted_collection).concat(Object.keys(data.FLOATS)),
                        bottom: 0
                    },
                    xAxis: {
                        type: 'category',
                        data: data.YEARS
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: 'Number of profiles collected'
                        },
                        {
                            type: 'value',
                            name: 'Number of active floats',
                            position: 'right'
                        }
                    ],
                    series: echartsSeries
                };

                myChart.setOption(option);
            }
            //Même graphique mais en %
            if ($("#Histogram_percent").length > 0) {
                // Calcul des totaux par année
                var yearsCount = data.YEARS.length;
                var totals = Array(yearsCount).fill(0);
                $.each(sorted_collection, function (index, values) {
                    for (var i = 0; i < yearsCount; i++) {
                        totals[i] += values[i];
                    }
                });
//                console.log('totals', totals); // Vérifie si totals[année 2017] vaut 0

                // Construction des séries en pourcentage
                var echartsSeriesPercent = [];
                $.each(sorted_collection, function (index, values) {
                    echartsSeriesPercent.push({
                        name: index,
                        type: 'bar',
                        stack: 'profiles',
                        data: values.map(function (value, i) {
                            return totals[i] ? (100 * value / totals[i]) : 0;
                        }),
                        itemStyle: { color: data.COLOR[index] }
                    });
                });


                // Initialisation du graphique ECharts
                var chartDomPercent = document.getElementById('Histogram_percent');
                var myChartPercent = echarts.init(chartDomPercent);

                var optionPercent = {
                    title: {
                        text: 'Histogram of profiles on Argo GDAC (in %)'
                    },
                    subtitle: {
                        text: '(C) Coriolis data center - ' + data.DATE,
                        left: 'center',
                        top: 30
                    },
                    tooltip: {
                        trigger: 'axis',
                        valueFormatter: function (value) {
                            return value.toFixed(1) + ' %';
                        }
                    },
                    legend: {
                        data: Object.keys(sorted_collection).concat(Object.keys(data.FLOATS)),
                        bottom: 0
                    },
                    xAxis: {
                        type: 'category',
                        data: data.YEARS
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: 'Percentage of profiles collected',
                            min: 0,
                            max: 100,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                        {
                            type: 'value',
                            name: 'Number of active floats',
                            position: 'right'
                        }
                    ],
                    series: echartsSeriesPercent
                };

                myChartPercent.setOption(optionPercent);
            }
        });
    });
});

// Fonction de tri par valeur décroissante
function sortCollection(data) {
    var items = Object.entries(data);
    items.sort(function (a, b) {
        return b[1][0] - a[1][0]; // trie selon la première valeur de chaque série
    });
    var sorted_collection = {};
    items.forEach(function (item) {
        sorted_collection[item[0]] = item[1];
    });
    return sorted_collection;
}

// Fonction de tri par valeur décroissante
function sortCollection(data) {
    var items = Object.entries(data);
    items.sort(function (a, b) {
        return b[1][0] - a[1][0]; // trie selon la première valeur de chaque série
    });
    var sorted_collection = {};
    items.forEach(function (item) {
        sorted_collection[item[0]] = item[1];
    });
    return sorted_collection;
}