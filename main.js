var data;
var selected_month = 1;
var selected_price_range = "015";


function draw_top_chart() {

    var svg = d3.select("body").append("svg").attr("width", 800).attr("height", 200),
        margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]);
    var z = d3.scaleOrdinal(d3.schemeCategory10);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var fdata = data.filter(function (d) {
        return d.mois === selected_month;
    });
    console.log(fdata);
    var property = "logements_" + selected_price_range;

    x.domain([0, d3.max(fdata, function (d) {
        return d[property];
    })]);
    y.domain(fdata.map(function (d) {
        return d.ville;
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
            return "translate(0," + y(d.ville) + ")"
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
            return z(d.country)
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
        .attr("dy", 35)
        .text(function (d) {
            return d.ville;
        })
}

d3.json("data.json", function (error, d) {
    if (error) throw error;

    data = d;
    data.sort(function (a, b) {
        return a.logements - b.logements;
    });

    console.log(data);
    draw_top_chart();

});

