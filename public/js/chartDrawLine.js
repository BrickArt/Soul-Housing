
var colors = { red: "rgb(255, 99, 132)", orange: "rgb(255, 159, 64)", yellow: "rgb(255, 205, 86)", green: "rgb(75, 192, 192)", blue: "rgb(54, 162, 235)", purple: "rgb(153, 102, 255)", grey: "rgb(201, 203, 207)" };
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        title:{
            display:false,
            text:'Payments title chart'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM D'
                    }
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Sums'
                }
            }]
        }
    }
};


var drawChart = function(program, start, end) {
    var ctx = document.getElementById("chartCanvasPayments").getContext("2d");
    if (!program) program = "CASH";
    $.ajax({
        url: '/api/report/payments',
        method: 'POST',
        dataType: 'json',
        data: {
            "start": new Date(start),
            "end": new Date(end),
            "program": program
        }
    })
        .done(function (paymentsArray) {
            var yAxesValues = [];
            var xAxesValues = [];
            var days = [];
            paymentsArray.forEach(function (payment) {
                var date = new Date([payment._id.year, payment._id.month, payment._id.day].join("-"));

                yAxesValues.push(payment.totalSum);
                // xAxesValues.push(moment(date).format('MMM D'));
                xAxesValues.push(date);
            });
            console.log(xAxesValues);

/*
            function nullsAdd(nullsCount) {
                for (var i = 0; i <= nullsCount; i++) {
                    resultWithNulls.push(0)
                }
            }

            var resultWithNulls = [];
            for (var i in xAxesValues) {
                var el = xAxesValues[i];

                var beginingDate = new Date(xAxesValues[i]);
                var endingDate = new Date(xAxesValues[i + 1]);

                var diff = Math.floor((endingDate.getTime() - beginingDate.getTime()) / 24 / 60 / 60 / 1000);
                resultWithNulls.push(yAxesValues[i]);
                if (diff > 0) {
                    nullsAdd(diff)
                }
            }
            */


            config.data.labels = xAxesValues;
            config.data.datasets = [{
                label: "payments",
                backgroundColor: colors.blue,
                borderColor: colors.blue,
                data: yAxesValues,
                fill: false,
            }];
            if (window.canvasPayments) window.canvasPayments.destroy();
            window.canvasPayments = new Chart(ctx, config);


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

//переключатель програм
$( "#sel1" ).change(function() {
    drawChart(this.value, moment().subtract(29, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
});