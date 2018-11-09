var months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'September', 'Octobre', 'Novembre', 'Decembre'];
var now = new Date();
var month_name = months[now.getMonth()]; //
var data;
var selected_month = now.getMonth() + 1;
var selected_price_range = "115";
var selected_country = "";

function draw_top_chart(element) {
    var fdata;
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 500).attr("height", 800),
        margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);

    var property = "logements_" + selected_price_range;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    fdata = data.filter(function (d) {
        if (selected_country === "") {
            return d.Mois === selected_month && d[property] > 0;
        } else {
            return d.Mois === selected_month && d[property] > 0 && d.Pays === selected_country;
        }
    });

    console.log(data.filter(function(d){
        return d.Pays==="France";
    }));

    fdata = fdata.sort(function (a, b) {
        return d3.ascending(+a[property], +b[property]);
    });


    x.domain([0, d3.max(fdata, function (d) {
        return d[property];
    })]);
    y.domain(fdata.map(function (d) {
        return d.Ville;
    })).padding(0.1);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        /*.call(d3.axisBottom(x).ticks(5).tickFormat(function (d) {
            return parseInt(d / 1000);
        }).tickSizeInner([-height]));*/
        .call(d3.axisBottom(x).ticks(5));

    /*g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));*/

    var groups = g.selectAll(".gr")
        .data(fdata)
        .enter().append("g")
        .attr("class", "gr")
        .attr("transform", function (d) {
            return "translate(0," + y(d.Ville) + ")"
        });

    groups.append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", 0)
        .attr("width", function (d) {
            return x(d[property]);
        })
        .attr("fill", function (d) {
            return d.Couleur;
        })
        .on("mousemove", function (d) {
            tooltip
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("display", "inline-block")
                .html((d[property]) + "<br>" + "logements");
        })
        .on("mouseout", function (d) {
            tooltip.style("display", "none");
        });

    groups.append("image")
        .attr("x", -50)
        .attr("y", 5)
        .attr("width", 30)
        .attr("height", 25)
        .attr('xlink:href', function (d) {
            if (d.country_code !== undefined) {
                return "flags/flags/4x3/" + d.country_code + ".svg";
            } else {
                return "flags/flags/4x3/fr.svg";
            }
        });

    groups.append("text")
        .attr("dx", 43)
        .attr("dy", 22)
        .style('fill', 'black')

        .text(function (d) {
            return d.Ville;
        })
}

function draw_country_chart(element) {

    var fdata;
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 500).attr("height", 500),
        margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    fdata = nested_data.filter(function (d) {
        return d.value.total > 10;
    });
    fdata = fdata.sort(function (a, b) {
        return d3.ascending(+a.value.total, +b.value.total);
    });

    x.domain([0, d3.max(fdata, function (d) {
        return d.value.total;

    })]);
    y.domain(fdata.map(function (d) {
        return d.key;
    })).padding(0.1);


    /*g.append("g")
        .attr("class", "y axis")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));*/

    var groups = g.selectAll(".gr")
        .data(fdata)
        .enter().append("g")
        .attr("class", "gr")
        .attr("transform", function (d) {
            return "translate(0," + y(d.key) + ")"
        });

    groups.append("rect")
        .attr("class", "bar country_bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", 0)
        .attr("width", function (d) {
            return x(d.value.total);
        })
        .attr("fill", function (d) {
            return d.value.couleur;
        })
        .on("click", function (d) {
            selected_country = d.key;
            draw_top_chart("chart");
        });

    groups.append("image")
        .attr("x", -50)
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", 22)
        .attr('xlink:href', function (d) {
            if (d.value.countrycode !== undefined) {
                return "flags/flags/4x3/" + d.value.countrycode + ".svg";
            } else {
                return "flags/flags/4x3/fr.svg";
            }
        });

    groups.append("text")
        .attr("dx", 43)
        .attr("dy", 25)
        .style('fill', 'black')

        .text(function (d) {
            return d.key;
        })
}

// Wait for juqery to be loaded !
$(function () {
    d3.csv(URL, function (d) {
        data = d;
        data.forEach(function (d) {
            d.Mois = +d.Mois;
            d.logements_115 = +d.logements_115;
            d.logements_1630 = +d.logements_1630;
            d.logements_3150 = +d.logements_3150;
        });
        console.log(data);

        // Compute data for 2nd chart
        nested_data = d3.nest()
            .key(function (d) {
                return d.Pays;
            })
            .rollup(function (d) {
                return {
                    "total": d3.sum(d, function (e) {
                        return e.logements_115 + e.logements_3150 + e.logements_1630 / 12;

                    }), "couleur": d[0].Couleur, "countrycode": d[0].country_code
                }
            }).entries(data);


        draw_top_chart("chart");
        draw_country_chart("country_chart");

        $(".mon_btn").click(function () {
            $(".mon_btn").removeClass("active");
            $(this).toggleClass("active");
            selected_month = +$(this).attr("id").replace("btn-", "");
            draw_top_chart("chart");

        });

        $("#btn-11").toggleClass("active");
        $("#btn-115").toggleClass("active");

        $(".prix_btn").click(function () {
            $(".prix_btn").removeClass("active");
            $(this).toggleClass("active");
            selected_price_range = +$(this).attr("id").replace("btn-", "");
            draw_top_chart("chart");

        });

        $("#reset_country").click(function(){
            selected_country = "";
            draw_top_chart("chart");
        })
    });
});
var URL = "https://docs.google.com/spreadsheets/d/16Lqk3AiFAMLxjlRmRBQc4KgaOBFScnTbNVyPag0yQOU";
URL += "/pub?single=true&output=csv";


