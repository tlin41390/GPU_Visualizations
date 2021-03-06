function main() {
    const canvasWidth = 1200;
    const canvasHeight = 700;
    const margin = 200;

    const svg = d3.select("#heat_map").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

    const width = svg.attr("width") - margin - 500;
    const height = svg.attr("height") - margin;

    //add the text to the canvas for the title


    const container_g = svg.append("g")
        .attr("transform", "translate(200,100)");

    d3.csv("CSV/condensed_ebay_prices.csv", (d) => { return { time: d["Month"], mode: d["GPUs"], bought: +d["Sold"] } }).then(data => {
        const myGroups = Array.from(new Set(data.map(d => d.mode)))
        const myRows = Array.from(new Set(data.map(d => d.time)))

        // create a tooltip
        const Tooltip = d3.select("#heat_map")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("font-family", "sans-serif")
            .style("transform", "translate(0px,0px)")
            .style("width", "200px")
            .style("padding", "5px")

        const mouseover = function () {
            Tooltip
                .style("opacity", 1)
            d3.select(this).raise().classed("active", true);
            d3.select(this)
                .style("stroke", "black").style("opacity", 1)
        }

        const mousemove = function (event, d) {
            Tooltip
                .html(d.mode + "<br>" + d.bought + " Units Sold")
                .style("left", event.pageX + 30 + "px")
                .style("top", event.pageY + "px")
        }
        var mouseleave = function () {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        }

        const x = d3.scaleBand()
            .range([0, width])
            .domain(myRows)
            .padding(0.05)

        const y = d3.scaleBand()
            .range([height, 0])
            .domain(myGroups)
            .padding(0.05)

        container_g.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        container_g.append("g")
            .style("font-size", 15)
            .attr("transform", 'translate(0,' + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        const myColor = d3.scaleSequential()
            .interpolator(d3.interpolateBlues)
            .domain([100, d3.max(data, (d) => { return d.bought })])

        container_g.selectAll()
            .data(data, (d) => { return d.time + ":" + d.mode })
            .join("rect")
            .attr("x", (d) => { return x(d.time) })
            .attr("y", (d) => { return y(d.mode) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => { return myColor(d.bought) })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        //translate the color scale
        container_g.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(550,300)")
            .attr("font-family", "sans-serif")

        //set the color and size legend for the bubble chart
        const legendOrdinal = d3.legendColor()
            .labelFormat(d3.format(".0f"))
            .title("Units Sold")
            .titleWidth(100)
            .shapeWidth(40)
            .shapeHeight(40)
            .shapePadding(-2)
            // .attr("font-size","15px")
            .scale(myColor);

        container_g.select(".legendOrdinal")
            .call(legendOrdinal);

    })



}
main();
