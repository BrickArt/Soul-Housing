var colors1 = ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(201, 203, 207)"];


var drawChartDonut = function() {
    var chartCanvasUsers = document.getElementById("chartCanvasUsers").getContext("2d");
    $.ajax({
        url: '/api/report/users',
        method: 'POST',
        dataType: 'json',
    })
        .done(function (usersArray) {

            //custom tooltips that always visible
            Chart.pluginService.register({
                beforeRender: function (chart) {
                    if (chart.config.options.showAllTooltips) {
                        chart.pluginTooltips = [];
                        chart.config.data.datasets.forEach(function (dataset, i) {
                            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                                chart.pluginTooltips.push(new Chart.Tooltip({
                                    _chart: chart.chart,
                                    _chartInstance: chart,
                                    _data: chart.data,
                                    _options: chart.options.tooltips,
                                    _active: [sector]
                                }, chart));
                            });
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }, afterDraw: function (chart, easing) {
                    if (chart.config.options.showAllTooltips) {
                        if (!chart.allTooltipsOnce) {
                            if (easing !== 1) return;
                            chart.allTooltipsOnce = true;
                        }
                        chart.options.tooltips.enabled = true;
                        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                            tooltip.initialize();
                            tooltip.update();
                            tooltip.pivot();
                            tooltip.transition(easing).draw();
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }
            });

            var yAxesValues = [];
            var xAxesValues = [];
            var segmentColor = [];
            usersArray.forEach(function (user) {
                yAxesValues.push(user.count);
                xAxesValues.push(user.program);
                segmentColor.push(colors1.shift());
            });
            var options = {
                "type": "doughnut",
                "data": {
                    "labels": xAxesValues,
                    "datasets": [{
                        "label": "Programs",
                        "data": yAxesValues,
                        "backgroundColor": ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)", "rgb(255, 159, 64)", "rgb(75, 192, 192)", "rgb(201, 203, 207)"]
                    }]
                },
                "options": {
                    "showAllTooltips": true
                }
            };

            if (window.canvasUsers) window.canvasUsers.destroy();
            window.canvasUsers = new Chart(chartCanvasUsers, options);


        })
        .fail(function (e) {
            console.log(e);
            document.getElementById("chartCanvasPayments").value = "error " + e
        })
        .always(function (e) {
            console.log(e);
            document.getElementById("chartCanvasPayments").value = "loading . . ."
        });
};