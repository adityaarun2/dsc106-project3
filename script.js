// Define dimensions for the visualization
const margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append SVG to the body
const svg = d3.select("#visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load data
d3.json('file.json').then(data => {
    // Process data here

    // Example of processing and plotting shots
    // Assume X and Y are normalized (0-1), adjust scales accordingly
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    
    // Define a scale for the shot result colors
    const colorScale = d3.scaleOrdinal()
        .domain(["Goal", "Missed", "Saved", "Blocked"])
        .range(["#4CAF50", "#F44336", "#2196F3", "#FFC107"]);
    
    // Define a scale for the circle size based on xG
    const sizeScale = d3.scaleLinear()
        .domain([0, 1])
        .range([5, 15]); // Adjust min and max size as needed
    
    // Tooltip setup
    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
    
    svg.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", d => xScale(d.X))
        .attr("cy", d => yScale(d.Y))
        .attr("r", d => sizeScale(d.xG))
        .attr("fill", d => colorScale(d.result))
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Shot Type: ${d.shotType}<br>Match: ${d.h_team} vs ${d.a_team}<br>Date: ${d.date}<br>Assisted by: ${d.player_assisted}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition().duration(500).style("opacity", 0);
        });
}).catch(error => console.log(error));
