/*
 Copyright 2017 Sefa Eyeoglu

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function () {
    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        }
    }

    var wrapper = $('.wrapper');

    $(document).ready(function () {
        //INIT
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        var medipingTheme = {
            colors: ['#F44336', '#03A9F4', '#FFEB3B'],
            chart: {
                backgroundColor: '#263238',
                borderWidth: 0,
                borderRadius: 0
            },
            title: {
                style: {
                    color: '#ECEFF1',
                    font: 'bold 16px "Lato", "Helvetica", "Verdana", "Arial", sans-serif'
                }
            },
            subtitle: {
                style: {
                    color: '#ECEFF1',
                    font: 'bold 12px "Lato", "Helvetica", "Verdana", "Arial", sans-serif'
                }
            },

            legend: {
                itemStyle: {
                    font: '9pt "Lato", "Helvetica", "Verdana", "Arial", sans-serif',
                    color: '#ECEFF1'
                },
                itemHoverStyle: {
                    color: '#B0BEC5'
                },
                itemHiddenStyle: {
                    color: '#B0BEC5'
                }
            },
            xAxis: {
                gridLineWidth: 0,
                lineColor: '#607D8B',
                tickColor: '#607D8B',
                labels: {
                    style: {
                        color: '#607D8B',
                        font: '12px "Lato", "Helvetica", "Verdana", "Arial", sans-serif'
                    }
                },
                title: {
                    style: {
                        color: '#607D8B',
                        font: 'thin 12px "Lato", "Helvetica", "Verdana", "Arial", sans-serif'
                    }
                }
            },
            yAxis: {
                alternateGridColor: null,
                minorTickInterval: null,
                lineColor: '#607D8B',
                tickColor: '#607D8B',
                gridLineColor: '#607D8B',
                minorGridLineColor: '#607D8B',
                lineWidth: 0,
                tickWidth: 0,
                labels: {
                    style: {
                        color: '#607D8B',
                        font: '12px "Lato", "Helvetica", "Verdana", "Arial", sans-serif'
                    }
                },
                title: {
                    style: {
                        color: '#607D8B',
                        font: 'thin 12px "Lato", "Helvetica", "Verdana", "Arial", sans-serif'
                    }
                }
            }
        };
        Highcharts.setOptions(medipingTheme);

        var last1hSeries = [],
            last24hSeries = [],
            last7dSeries = [],
            last365dSeries = [];

        var last1hChart = {
            chart: {
                type: 'spline',
                animation: Highcharts.svg
            },
            title: {
                text: 'last 1h'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'ms'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + this.y + "ms";
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: false
            },
            series: last1hSeries
        };

        var last24hChart = {
            chart: {
                type: 'spline',
                animation: Highcharts.svg
            },
            title: {
                text: 'last 24h'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'ms'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + this.y + "ms";
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: false
            },
            series: last24hSeries
        };

        var last7dChart = {
            chart: {
                type: 'spline',
                animation: Highcharts.svg
            },
            title: {
                text: 'last 7d'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'ms'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + this.y + "ms";
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: false
            },
            series: last7dSeries
        };

        var last365dChart = {
            chart: {
                type: 'spline',
                animation: Highcharts.svg
            },
            title: {
                text: 'last 365d'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'ms'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + this.y + "ms";
                }
            },
            legend: {
                enabled: true
            },
            exporting: {
                enabled: false
            },
            series: last365dSeries
        };

        $.ajax({
            url: "collectedData.json",
            method: "GET",
            success: function (data) {
                $.each(data, function (host, hostData) {


                    last1hSeries.push({
                        name: host,
                        data: (function () {
                            var data = [];
                            var times = 0;
                            var displayedData = hostData;
                            if (displayedData.length > 60)
                                displayedData = hostData.slice(hostData.length - 60);
                            if (displayedData.length > 1000) {
                                var tempArray = displayedData.slice,
                                    maxChunkSize = 3;
                                do {
                                    tempArray = averageChunks(displayedData, maxChunkSize);
                                    console.debug(maxChunkSize);
                                    maxChunkSize = maxChunkSize - 1;
                                } while (tempArray.length < 500);
                                displayedData = tempArray;
                            }

                            $.each(displayedData, function (i, entry) {
                                if (entry.time !== -1) {
                                    data.push({
                                        x: entry.timestamp * 1000,
                                        y: roundToPlaces(entry.time * 1000, 3)
                                    });
                                }
                                times++;
                            });
                            return data;
                        }())
                    });


                    last24hSeries.push({
                        name: host,
                        data: (function () {
                            var data = [];
                            var times = 0;
                            var displayedData = hostData;
                            if (displayedData.length > 60 * 24)
                                displayedData = hostData.slice(hostData.length - (60 * 24));
                            if (displayedData.length > 1000) {
                                var tempArray = displayedData.slice,
                                    maxChunkSize = 3;
                                do {
                                    tempArray = averageChunks(displayedData, maxChunkSize);
                                    console.debug(maxChunkSize);
                                    maxChunkSize = maxChunkSize - 1;
                                } while (tempArray.length < 500);
                                displayedData = tempArray;
                            }

                            $.each(displayedData, function (i, entry) {
                                if (entry.time !== -1) {
                                    data.push({
                                        x: entry.timestamp * 1000,
                                        y: roundToPlaces(entry.time * 1000, 3)
                                    });
                                }
                                times++;
                            });
                            return data;
                        }())
                    });


                    last7dSeries.push({
                        name: host,
                        data: (function () {
                            var data = [];
                            var times = 0;
                            var displayedData = hostData;
                            if (displayedData.length > 60 * 24 * 7)
                                displayedData = hostData.slice(hostData.length - (60 * 24 * 7));
                            if (displayedData.length > 1000) {
                                var tempArray = displayedData.slice,
                                    maxChunkSize = 10;
                                do {
                                    tempArray = averageChunks(displayedData, maxChunkSize);
                                    console.debug(maxChunkSize);
                                    maxChunkSize = maxChunkSize - 1;
                                } while (tempArray.length < 500);
                                displayedData = tempArray;
                            }

                            $.each(displayedData, function (i, entry) {
                                if (entry.time !== -1) {
                                    data.push({
                                        x: entry.timestamp * 1000,
                                        y: roundToPlaces(entry.time * 1000, 3)
                                    });
                                }
                                times++;
                            });
                            return data;
                        }())
                    });


                    last365dSeries.push({
                        name: host,
                        data: (function () {
                            var data = [];
                            var times = 0;
                            var displayedData = hostData;
                            if (displayedData.length > 60 * 24 * 365)
                                displayedData = hostData.slice(hostData.length - (60 * 24 * 365));
                            if (displayedData.length > 1000) {
                                var tempArray = displayedData.slice,
                                    maxChunkSize = 720;
                                do {
                                    tempArray = averageChunks(displayedData, maxChunkSize);
                                    console.debug(maxChunkSize + ", " + tempArray.length);
                                    maxChunkSize = maxChunkSize - 1;
                                } while (tempArray.length < 500);
                                displayedData = tempArray;
                            }
                            $.each(displayedData, function (i, entry) {
                                if (entry.time !== -1) {
                                    data.push({
                                        x: entry.timestamp * 1000,
                                        y: roundToPlaces(entry.time * 1000, 3)
                                    });
                                }
                                times++;
                            });
                            return data;
                        }())
                    });

                });


                wrapper.html("<div class='stat' id='last1h'></div> <div class='stat' id='last24h'></div> <div class='stat' id='last7d'></div> <div class='stat' id='last365d'></div>");

                var last1h = $("#last1h"),
                    last24h = $("#last24h"),
                    last7d = $("#last7d"),
                    last365d = $("#last365d");

                last1h.highcharts(last1hChart);
                last24h.highcharts(last24hChart);
                last7d.highcharts(last7dChart);
                last365d.highcharts(last365dChart);
            }
        });


    });

    function roundToPlaces(number, places) {
        var divided = "1";
        for (var i = 0; i < places; i++) {
            divided += "0";
        }
        divided = Number(divided);
        return Math.round(number * divided) / divided

    }

    function averageChunks(data, chunkSize) {
        var processed = [];
        for (var i = 0; i < data.length; i += chunkSize) {
            if (i > data.length)
                i = data.length;
            var tempArray = data.slice(i, i + chunkSize);
            var sum = 0;
            var timestamp = 0;
            $.each(tempArray, function (i, entry) {
                if (entry.time === -1)
                    return;
                sum += entry.time;
                timestamp = entry.timestamp; //last timestamp
            });
            var avg = sum / tempArray.length;
            processed.push({
                timestamp: timestamp,
                time: avg
            });
        }
        return processed;
    }

})();