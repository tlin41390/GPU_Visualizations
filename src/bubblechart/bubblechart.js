function main() {
    const canvasWidth = 700;
    const canvasHeight = 700;
    const svg = d3.select("#bubble_chart")
        .append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

 

    const container_g = svg.append("g").attr("transform", "translate(100,100)")


    d3.csv("CSV/gpu_counts.csv").then((data) => {


        const size = d3.scaleLinear().domain([0, 20000])
            .range([7, 110])

        // create a tooltip
        const Tooltip = d3.select("#bubble_chart")
            .append("div")
            .style("opacity", 0)
            .attr("class", "column")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("font-family", "sans-serif")
            .style("width", "200px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function () {
            Tooltip
                .style("opacity", 1)
            d3.select(this).raise().classed("active", true);
            d3.select(this).style("stroke", "white")
        }

        const mousemove = function (event, d) {
            Tooltip
                .html(d.GPUs + "<br>" + d.Sold + " Units Sold")
                .style("left", event.pageX + 30 + "px")
                .style("top", event.pageY + "px")
        }
        var mouseleave = function () {
            Tooltip
                .style("opacity", 0)
            d3.select(this).style("stroke", "black")
        }

        var node = container_g.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", d => size(+d.Sold))
            .attr("cx", canvasWidth / 2 + 30)
            .attr("cy", canvasHeight / 2)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("data-tooltip", (d) => { +d.Sold })
            .style("fill", (d) => {
                if (d.GPUs.indexOf("GeForce") != -1) {
                    return "green"
                } else {
                    return "#D35400"
                }
            })
            .style("opacity", 0.5)
            .on("mouseover", mouseover) // What to do when hovered
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        const simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(canvasWidth / 2).y(canvasHeight / 2))
            .force("charge", d3.forceManyBody().strength(.1))
            .force("collide", d3.forceCollide().strength(.2).radius((d) => { return (size(+d.Sold) + 3) }).iterations(1))

        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) { return d.x })
                    .attr("cy", function (d) { return d.y })
            });
    });
}
main();
