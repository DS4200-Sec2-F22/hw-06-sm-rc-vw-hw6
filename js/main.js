// setting up constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 450;
const MARGINS = {left: 60, right: 60, top: 50, bottom: 50};

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

// make frame for Petal_Width vs Sepal_Width scatterplot
const FRAME2 =
    d3.select('#centerScatter')
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
        .domain([0, 5])
        .range([ 0, VIS_WIDTH]);
    FRAME2.append("g")
        .attr("transform", "translate(0," + 300 + ")")
        .call(d3.axisBottom(xScale));

    // Add y-axis
    const yScale = d3.scaleLinear()
        .domain([0, 3])
        .range([VIS_HEIGHT - 100, 0])
    FRAME2.append("g")
        .call(d3.axisLeft(yScale));

    // set specific color for each species
    const color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#1a64db", "#50ad5b", "#cf3c3e"])

    // add points to scatter plot
    const myCircle = FRAME2.append('g')
        .selectAll("dot")
        .data(data)
        // .data(data.map(function(d) { return +d; }))
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.Sepal_Width); } )
        .attr("cy", function (d) { return yScale(d.Petal_Width); } )
        .attr("r", 5)
        .style("fill", function (d) { return color(d.Species) } )
        .style("opacity", 0.5)
        .attr('class', 'datapoint');

    // Add brushing
    FRAME2
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
        myCircle.classed("selected", function(d){ return isBrushed(extent, xScale(d.Sepal_Width), yScale(d.Petal_Width) ) } )
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

// make frame for Petal_Width vs Sepal_Width scatterplot
const FRAME3 =
    d3.select('#rightGraph')
        .append('svg')
            .attr('height', FRAME_HEIGHT)
            .attr('width', FRAME_WIDTH)
            .attr('class', 'frame');

// read in the data
d3.csv("data/iris.csv").then( function(data) {
// creating x scale 
    const xScale = d3.scaleBand() // for categorical data 
                        .range([0, VIS_WIDTH])
                        .domain(data.map(d => d.Species))
                        .padding(0.2); 

    // creating Y scale 
    const yScale = d3.scaleLinear()
                        .domain([0, 60])
                        .range([VIS_HEIGHT, 100]); 
    // Adding x axis
    FRAME3.append("g")
            .attr("transform", "translate(" + MARGINS.left +
                "," + (VIS_HEIGHT + MARGINS.top - 100) + ")")
            .call(d3.axisBottom(xScale));  


    // Adding Y axis 
    FRAME3.append("g")
            .attr("transform", "translate(" + MARGINS.left +
                "," + (MARGINS.top - 100) + ")")
            .call(d3.axisLeft(yScale));  

    // set specific color for each species
    const color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#1a64db", "#50ad5b", "#cf3c3e"])

    // Add bars 
    FRAME3.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", (d) => {
                    // x pos depends on category 
                    return (xScale(d.Species) + MARGINS.left); 
                })
                .attr("y", yScale(50) + MARGINS.top - 100)
                .attr("height", VIS_HEIGHT - yScale(50))
                .attr("width", xScale.bandwidth()) 
                .style("fill", function (d) { return color(d.Species) } )
                .style("opacity", 0.5)
                .attr('class', 'bar');
                

    // Add brushing
    FRAME3
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
        myCircle.classed("selected", function(d){ return isBrushed(extent, xScale(d.Sepal_Width), yScale(d.Petal_Width) ) } )
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