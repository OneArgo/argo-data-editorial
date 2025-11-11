$(function () {
    $(document).ready(function () {
        $.getJSON("assets/json/histogram_gdac_delayed.json", function (data) {
            var gdacNames = data.GDAC;

            // 1. Calculer la somme des valeurs pour chaque GDAC
            var gdacSums = gdacNames.map(function (gdac) {
                var arr = data.UNAVAILABLE_VALUES[gdac] || [];
                return {
                    name: gdac,
                    sum: arr.reduce((a, b) => a + (b || 0), 0)
                };
            });

            // 2. Trier gdacNames selon la somme décroissante
            gdacSums.sort(function (a, b) { return b.sum - a.sum; });
            gdacNames = gdacSums.map(function (item) { return item.name; });

            var nbYears = data.UNAVAILABLE_VALUES[gdacNames[0]].length;

            // Si tu connais les années, remplace ici :
            var years = ["delayed-mode", "real-time"];
            for (var i = 0; i < nbYears; i++) {
                years.push("Year " + (i + 1));
            }

            // 3. Prépare une série par année dans le nouvel ordre
            var echartsSeries = [];
            for (var yearIdx = 0; yearIdx < nbYears; yearIdx++) {
                var values = gdacNames.map(function (gdac) {
                    return data.UNAVAILABLE_VALUES[gdac] ? data.UNAVAILABLE_VALUES[gdac][yearIdx] || 0 : 0;
                });
                echartsSeries.push({
                    name: years[yearIdx],
                    type: 'bar',
                    stack: 'years',
                    data: values
                });
            }

            if ($("#HistogramDataMode").length > 0) {
                var chartDom = document.getElementById('HistogramDataMode');
                var myChart = echarts.init(chartDom);

                var option = {
                    title: {
                        text: 'Profiles data modes per DAC: real-time vs delayed-mode',
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
                        data: years,
                        bottom: 0
                    },
                    xAxis: {
                        type: 'category',
                        data: gdacNames,
                        name: 'DAC',
                        axisLabel: {
                            fontSize: 8 // Diminue la taille du texte ici
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: 'Number of profiles'
                    },
                    series: echartsSeries
                };

                myChart.setOption(option);
            }

            if ($("#HistogramDataModePercent").length > 0) {
                // 1. Calcul des totaux par GDAC (somme des années pour chaque GDAC)
                var totals = gdacNames.map(function(gdac) {
                    var arr = data.UNAVAILABLE_VALUES[gdac] || [];
                    return arr.reduce((a, b) => a + (b || 0), 0);
                });

                // 2. Prépare les séries en pourcentage
                var echartsSeriesPercent = [];
                for (var yearIdx = 0; yearIdx < nbYears; yearIdx++) {
                    var values = gdacNames.map(function(gdac, gdacIdx) {
                        var val = data.UNAVAILABLE_VALUES[gdac] ? data.UNAVAILABLE_VALUES[gdac][yearIdx] || 0 : 0;
                        return totals[gdacIdx] ? 100 * val / totals[gdacIdx] : 0;
                    });
                    echartsSeriesPercent.push({
                        name: years[yearIdx],
                        type: 'bar',
                        stack: 'years',
                        data: values
                    });
                }

                var chartDom = document.getElementById('HistogramDataModePercent');
                var myChart = echarts.init(chartDom);

                var option = {
                    title: {
                        text: 'Profiles data modes per DAC: real-time vs delayed-mode (%)',
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
                        data: years,
                        bottom: 0
                    },
                    xAxis: {
                        type: 'category',
                        data: gdacNames,
                        name: 'DAC',
                        axisLabel: {
                            fontSize: 8
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: 'Percentage of profiles',
                        min: 0,
                        max: 100,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                    series: echartsSeriesPercent
                };

                myChart.setOption(option);
            }

        });
    });
});