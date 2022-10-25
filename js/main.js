// setting up constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// make frame for Petal_Length vs Sepal_Length scatterplot
const FRAME1 =
    d3.select('#leftScatter')
        .append('svg')
            .attr('height', FRAME_HEIGHT)
            .attr('width', FRAME_WIDTH)
            .attr('class', 'frame')
        .append('g')
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");

// read in the data
d3.csv("data/iris.csv").then( function(data) {
    // add x-axis
    const xScale = d3.scaleLinear()
        .domain([0, 8])
        .range([ 0, VIS_WIDTH]);
  	FRAME1.append("g")
    	.attr("transform", "translate(0," + 300 + ")")
    	.call(d3.axisBottom(xScale));

	// Add y-axis
	const yScale = d3.scaleLinear()
  		.domain([0, 7])
  		.range([VIS_HEIGHT - 100, 0])
	FRAME1.append("g")
  		.call(d3.axisLeft(yScale));

    // set specific color for each species
    const color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#1a64db", "#50ad5b", "#cf3c3e"])

    // add points to scatter plot
    const myCircle = FRAME1.append('g')
    	.selectAll("dot")
    	.data(data)
        // .data(data.map(function(d) { return +d; }))
    	.enter()
    	.append("circle")
      	.attr("cx", function (d) { return xScale(d.Sepal_Length); } )
      	.attr("cy", function (d) { return yScale(d.Petal_Length); } )
      	.attr("r", 5)
      	.style("fill", function (d) { return color(d.Species) } )
		.style("opacity", 0.5)
      	.attr('class', 'datapoint');




	// Add brushing
  	FRAME1
		// add brushing feature
    	.call( d3.brush()
		// initialize brush area
      	.extent( [ [0,0], [VIS_WIDTH,VIS_HEIGHT] ] )
		// when brush area selection changes, trigger updateChart function below
      	.on("start brush", updateChart)
    )

	// function is triggered when brush area is updated
	function updateChart() {
	  	extent = d3.event.selection;
	  	myCircle.classed("selected", function(d){ return isBrushed(extent, xScale(d.Sepal_Length), yScale(d.Petal_Length) ) } )
    }

  	// true or false, depending on selection pointsxw
  	function isBrushed(brush_coords, cx, cy) {
       const x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  	}

})