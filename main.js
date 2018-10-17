// colors
const yellow = "#FFB900";
const red = "#FF4343";
const green = "#00CC6A";
//Data Object
const data = [
    {
        fruit: "pineapple",
        coolness: 100,
        background: yellow
    },
    {
        fruit: "apple",
        coolness: 45,
        background: red
    },
    {
        fruit: "lime",
        coolness: 30,
        background: green
    },
    {
        fruit: "banana",
        coolness: 0,
        background: green
    }
];
//Setup chart size
const width = 800;
const barHeight = 50;
const ease = d3.easeCubic;
//Set Scale - 0 to 100 goes 0 to width of chart
const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
const y = d3.scaleBand()
    .domain(data.map(function(d) { return d.fruit }))
    .range([0, barHeight*data.length]);
//Select chart from DOM and add attrs
const chart = d3
    .select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length + 20)


//Setup svg groups and feed data
const bar = chart
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 1.2 * barHeight + ")";
    });

//Add rectangles (bars)
bar
    .append("rect")
    .attr("width", 0)
    //animate
    .transition()
    .duration(1500)
    .ease(d3.easeBounce)
    .attr("width", function(d){
        return x(d.coolness);
    })
    .delay(function(d, i){
        return (i*500);
    })
    // .style("width", function(d) {
    // if(d.coolness > 0) {
    //   return x(d.coolness) + "px";
    // } else {
    //   return (200 + "px");
    // }
    // })
    .attr("height", barHeight - 1)
    .attr("fill", function(d) {
        if (d.coolness > 0) {
            return d.background;
        } else {
            return 'transparent';
        }
    })

//Add text to bars
// chart
//   .append('g')
//   .attr('transform', `translate(0, ${barHeight*data.length-0})`)
//   .call(d3.axisBottom(x));

//   chart
//     .append('g')
//     .attr('transform', `translate(50, 0)`)
//     .call(d3.axisLeft(y));

bar
    .append("text")
    .attr("x", function(d) {
        if (d.coolness > 0){
            return x(d.coolness) - 8;
        } else {
            return 50;
        }
    })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .attr("fill", "white")
    .text(function(d) {
        return d.fruit;
    });
