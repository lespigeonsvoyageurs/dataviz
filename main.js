var data;
var selected_month = 1;
var selected_price_range = "115";




function draw_top_chart(element) {

    var fdata;
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 800).attr("height", 200),
        margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);
    var z = d3.scaleOrdinal(['#7C1354','#B2190E','#FF9F1C','#7CAD2E','#21DADD', '#ba778b','#b2651e','#fbff80','#63ad72','#478add']);

    var property = "logements_" + selected_price_range;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    fdata = data.filter(function (d) {
        return d.Mois === selected_month;
    });
    fdata = fdata.sort(function(a,b){
        return d3.ascending(+a[property],+b[property]);
    });

    console.log(fdata);

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
            return z(d.Pays)
        })
        .on("mousemove", function (d) {
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d[property]) + "<br>" + "logements");
        })
        .on("mouseout", function (d) {
            tooltip.style("display", "none");
        });

    groups.append("text")
        .attr("dx", 30)
        .attr("dy", 25)

.text(function (d) {
            return d.Ville;
        })
}

var URL = "https://docs.google.com/spreadsheets/d/16Lqk3AiFAMLxjlRmRBQc4KgaOBFScnTbNVyPag0yQOU";
URL += "/pub?single=true&output=csv";

d3.csv(URL, function (d) {
    data = d;
    data.forEach(function(d){
       d.Mois = +d.Mois;
       d.logements_115 = +d.logements_115;
        d.logements_1630 = +d.logements_1630;
        d.logements_3150 = +d.logements_3150;
    });
    console.log(data);
    draw_top_chart("chart");

    $(".mon_btn").click(function (e) {
        selected_month = +$(this).attr("id").replace("btn-", "");
        console.log(selected_month);
        draw_top_chart("chart");
    });

    $(".prix_btn").click(function (e) {
        selected_price_range = +$(this).attr("id").replace("btn-", "");
        console.log(selected_price_range);
        draw_top_chart("chart");
    });
});
