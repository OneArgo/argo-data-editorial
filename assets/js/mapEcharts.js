// Define global variables
var BJData = []; // This will hold your BJData globally
var mindate;
var startTime = Date.now();
var map;
var echartslayer;
var loop;
var form = "mercator";
var intervalid;
const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const dayinterval = 6 * 60 * 60 * 24 * 1000;

function initializeMap() {
    showloading();
    mapboxgl.accessToken =
        "pk.eyJ1IjoiYmdvbnRpZXIiLCJhIjoiY2x5NzZ5c2RtMDMwcTJpczk2MWl2bGNkbiJ9.BqgxlFA18JAH6p07bXfI0g";
    map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/satellite-v8",
        //style: "mapbox://styles/mapbox/light-v11",
        //style: "mapbox://styles/mapbox/standard",
        center: [0, 0],
        zoom: 1,
        projection: form,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("dragend", () => {
        if (form == "globe") {
            setupECharts(BJData);
        }
    });

    map.on("load", loadData);
    map.on("dragend", globeFilter);
    map.on("zoom", globeFilter);
    map.on("style.load", () => {
        map.setPaintProperty("background", "background-color", "#000000");
        map.setFog({
            color: "rgb(186, 210, 235)", // Lower atmosphere
            "high-color": "rgb(36, 92, 223)", // Upper atmosphere
            "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
            "space-color": "rgb(11, 11, 25)", // Background color
            "star-intensity": 0.6, // Background star brightness (default 0.35 at low zoooms )
        });
    });
}
async function loadData() {
    BJData = [];
    mindate = new Date();
    maxdate = new Date(0);

    try {
        const data = await d3.csv("assets/csv/stations-argo-12months.csv", d3.autoType); // <-- CSV file path

        // Group data by platform_code (equivalent to ID)
        const grouped = {};
        data.forEach(d => {
            const id = d.platform_code;
            if (!grouped[id]) grouped[id] = [];
            grouped[id].push([id, new Date(d.station_date), d.longitude, d.latitude, d.dac]);
        });

        Object.keys(grouped).forEach((p) => {
            const group = grouped[p];
            const id = group[0][0];
            let startdate = group[0][1];
            let enddate = group[0][1];

            for (let i = 0; i < group.length; i++) {
                const date = group[i][1];
                if (date < startdate) startdate = date;
                if (date > enddate) enddate = date;
            }

            if (enddate > maxdate) maxdate = enddate;
            if (startdate < mindate) mindate = startdate;

            const coords = group.map(item => [item[2], item[3]]);

            verifmeridian(coords);
            if (coords.length === 1) coords[1] = coords[0];

            BJData.push({
                coords: coords,
                id: id,
                startdate: startdate,
                enddate: enddate,
                dac: group[0][4]
            });
        });

        setupECharts(BJData);
        hideloading();
    } catch (error) {
        console.error("Erreur lors du chargement ou de l'analyse du CSV : ", error);
        hideloading();
    }
}

function setupECharts(BJData) {

    const formatColorMap = {
        "AO": "#ffd166", // jaune
        "IF": "#06d6a0", // vert
        "ME": "#118ab2", // bleu
        "BO": "#06d6a0", // bleu-gris
        "HZ": "#f58231", // orange vif
        "CS": "#ef476f", // rose vif
        "KM": "#C81FF0", // violet
        "KO": "#FF66B3", // rose
        "IN": "#bda29a", // beige rosé
        "JA": "#f7ff3c", // jaune vif
        "default": "#6e7074" // gris acier
    };

    showTime();
    const center = map.getCenter().lng;

    var series = BJData.map((data, index) => {
        const longi = Math.abs(data.coords[0][0] - center);
        const color = formatColorMap[data.dac] || formatColorMap.default;

        return {
            name: data.id,
            coordinateSystem: "GLMap",
            type: "lines",
            polyline: true,
            effect: {
                delay: (data.startdate.getTime() - mindate.getTime()) / (dayinterval / 1000),
                period: (data.enddate.getTime() - data.startdate.getTime()) / dayinterval,
                show:
                    form == "mercator"
                        ? true
                        : longi <= 90 || longi >= 270
                            ? true
                            : false,
                loop: loop,
                trailLength: 0.9,
                symbolSize: 4,
                width: 5,
                color: color, // <-- color from format_code
            },
            lineStyle: {
                normal: {
                    color: color, // <-- color from format_code
                    width: 5,
                    //curveness: 0.2,
                    opacity: 0,
                },
            },
            data: [data],
        };
    });
    var option = {
        GLMap: {
            roam: false,
        },
        coordinateSystem: "GLMap",
        title: {
            text: "Argo floats profiles",
            subtext: "last 12 months",
            left: "center",
            textStyle: {
                color: "#fff",
            },
        },
        tooltip: {
            trigger: "item",
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            top: "center",
            left: "right",
            itemHeight: 5,
            textStyle: {
                color: "#fff",
            },
            selectedMode: "multiple",
        },
        geo: {
            map: "GLMap",
            label: {
                emphasis: {
                    show: true,
                },
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: "#323c48",
                    borderColor: "#404a59",
                },
                emphasis: {
                    areaColor: "#2a333d",
                },
            },
        },
        series: series,
    };
    globaloption = option;
    if (echartslayer) {
        echartslayer.remove();
    }

    echartslayer = new EchartsLayer(map);
    echartslayer.chart.setOption(option);
}

// Function to show the time in the monthContainer
function showTime() {
    let interval = 1;
    clearInterval(intervalid); // On s'assure de ne pas lancer plusieurs intervalles
    intervalid = setInterval(() => {
        let date = new Date(mindate.getTime() + interval * dayinterval * 2000 / 1000);
        if (date > maxdate) {
            date = new Date(maxdate); // Gèle la date à maxdate
        }
        document.getElementById("monthContainer").textContent =
            month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        interval++;
    }, 2000);
}

function showloading() {
    document.getElementById("loading").style.display = "block";
}

function hideloading() {
    document.getElementById("loading").style.display = "none";
}

function verifmeridian(co) {
    for (i = 1; i < co.length; i++) {
        if (co[i][0] - co[i - 1][0] <= -300) {
            for (a = i; a < co.length; a++) {
                co[a][0] += 360;
            }
        }
        if (co[i][0] - co[i - 1][0] >= 300) {
            for (a = i; a < co.length; a++) {
                co[a][0] -= 360;
            }
        }
    }
}
function groupAndSortData(data) {
    const groupedData = {};
    const data1 = [];
    for (i = 0; i < data[0].p.length; i++) {
        data1.push([
            data[0].p[i],
            data[0].s[i],
            data[0].lo[i],
            data[0].la[i],
        ]);
    }
    // Group data by platform_code
    data1.forEach((item) => {
        if (!groupedData[item[0]]) {
            groupedData[item[0]] = [];
        }
        groupedData[item[0]].push(item);
    });

    // Sort each group by station_date
    Object.keys(groupedData).forEach((code) => {
        groupedData[code].sort((a, b) => a[1] - b[1]);
    });
    return groupedData;
}
function globeFilter() {
    if (form == "globe") {
        const center = map.getCenter();
        const centerLat = (center.lat * Math.PI) / 180; // Convert latitude to radians
        const centerLng = (center.lng * Math.PI) / 180; // Convert longitude to radians
        //console.log(globaloption.series)
        for (i = 0; i < globaloption.series.length; i++) {
            //const longi = Math.abs(globaloption.series[i].data.coords[0][0]-center);
            //console.log(globaloption.series[i].data[0].coords[0][0])
            const pointLat =
                (globaloption.series[i].data[0].coords[0][1] * Math.PI) / 180; // Convert latitude to radians
            const pointLng =
                (globaloption.series[i].data[0].coords[0][0] * Math.PI) / 180; // Convert longitude to radians

            const deltaLng = pointLng - centerLng;
            const isVisible =
                Math.sin(pointLat) * Math.sin(centerLat) +
                Math.cos(pointLat) * Math.cos(centerLat) * Math.cos(deltaLng) >=
                (1 / 3) * map.getZoom() - 1 / 3;

            globaloption.series[i].effect.show = isVisible;
        }
        if (echartslayer) {
            echartslayer.remove();
        }

        echartslayer = new EchartsLayer(map);
        echartslayer.chart.setOption(globaloption);
    }
}
document
    .getElementById("reloadButton")
    .addEventListener("click", function () {
        clearInterval(intervalid),
            document.getElementById("monthContainer").textContent = ""
        showTime()
        setupECharts(BJData);
    });

document
    .getElementById("loopButton")
    .addEventListener("click", function () {
        loop = !loop;
        clearInterval(intervalid),
            document.getElementById("monthContainer").textContent = ""
        showTime()
        if (loop) {
            loopButton.style.backgroundColor = "green";
        } else {
            loopButton.style.backgroundColor = "blueviolet";
        }

        setupECharts(BJData);
    });

document
    .getElementById("formButton")
    .addEventListener("click", function () {
        clearInterval(intervalid),
            document.getElementById("monthContainer").textContent = ""
        showTime()
        form == "mercator" ? (form = "globe") : (form = "mercator");
        form == "mercator"
            ? (formButton.style.backgroundColor = "orange")
            : (formButton.style.backgroundColor = "black");
        initializeMap();
    });

document
    .getElementById("fullScreen")
    .addEventListener("click", function () {
        clearInterval(intervalid),
            document.getElementById("monthContainer").textContent = ""
        showTime()
        form == "mercator" ? (form = "globe") : (form = "mercator");
        form == "mercator"
            ? (fullScreen.style.backgroundColor = "orange")
            : (fullScreen.style.backgroundColor = "black");
        initializeMap();

        // Ouvre une URL dans un nouvel onglet
        window.open("https://oneargo.github.io/argo-data-editorial/mapEcharts.html", "_blank");
    });

// Initialize the map on page load

initializeMap();
