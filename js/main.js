// setting up constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 450;
const MARGINS = {left: 60, right: 60, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// setting up three frames
const FRAME1 = d3.select('#leftScatter')
                .append('svg')
                .attr('height', FRAME_HEIGHT)
                .attr('width', FRAME_WIDTH)
                .attr('class', 'frame');

const FRAME2 = d3.select('#middleScatter')
                .append('svg')
                .attr('height', FRAME_HEIGHT)
                .attr('width', FRAME_WIDTH)
                .attr('class', 'frame');

const FRAME3 = d3.select('#rightBars')
                .append('svg')
                .attr('height', FRAME_HEIGHT)
                .attr('width', FRAME_WIDTH)
                .attr('class', 'frame');

// read in the data
d3.csv("data/iris.csv").then( function(data) {

// ALL FOR LEFT GRAPH
	// set scale for x-axis for left graph
	const xScaleLeft = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => {
			return parseInt(d.Sepal_Length);
		}) + 1])
		.range([0, VIS_WIDTH + MARGINS.left - 10]);
	// add x-axis on left graph
	FRAME1.append("g")
		.attr("transform", "translate(" + MARGINS.left +
			"," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(xScaleLeft));

	// set scale for y-axis for left graph
	const yScaleLeft = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => {
			return parseInt(d.Petal_Length);
		}) + 1])
		.range([VIS_HEIGHT, 0])
	// Add y-axis on left graph
	FRAME1.append("g")
		.attr('transform', "translate(" + MARGINS.left +
			"," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(yScaleLeft));

	// add points to left scatter plot
	left = FRAME1.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => {
			return (xScaleLeft(d.Sepal_Length) + MARGINS.left);
		}) // x value --> cx
		.attr("cy", (d) => {
			return (yScaleLeft(d.Petal_Length) + MARGINS.top);
		}) // y value --> cy
		.attr("r", 5) // point radius
		.attr("class", (d) => {
			return d.Species
		}); // fill depending on species

// ALL FOR MIDDLE GRAPH
	// set scale for x-axis for middle graph
	const xScaleMiddle = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => {
			return parseInt(d.Sepal_Width);
		}) + 1])
		.range([0, VIS_WIDTH + MARGINS.left - 10]);
	// add x-axis on middle graph
	FRAME2.append("g")
		.attr("transform", "translate(" + MARGINS.left +
			"," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(xScaleMiddle));

	// set scale for y-axis for middle graph
	const yScaleMiddle = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => {
			return parseInt(d.Petal_Width);
		}) + 1])
		.range([VIS_HEIGHT, 0])
	// Add y-axis on middle graph
	FRAME2.append("g")
		.attr('transform', "translate(" + MARGINS.left +
			"," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(yScaleMiddle));

	// add points to middle scatter plot
	middle = FRAME2.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => {
			return (xScaleMiddle(d.Sepal_Width) + MARGINS.left);
		}) // x value --> cx
		.attr("cy", (d) => {
			return (yScaleMiddle(d.Petal_Width) + MARGINS.top);
		}) // y value --> cy
		.attr("r", 5) // point radius
		.attr("class", (d) => {
			return d.Species
		}); // fill depending on species

// ALL FOR MIDDLE GRAPH
	const HARD_DATA = [{Species: "virginica", Count: 50}, {Species: "versicolor", Count: 50}, {
		Species: "setosa",
		Count: 50
	}];

	// set scale for x-axis for right graph
	const xScaleRight = d3.scaleBand() // for categorical data
		.range([0, VIS_WIDTH + MARGINS.right - 1])
		.domain(d3.range(HARD_DATA.length))
		.padding(0.2);
	// add x-axis on right graph
	FRAME3.append("g")
		.attr("transform", "translate(" + MARGINS.left +
			"," + (VIS_HEIGHT + MARGINS.top) + ")")
		.call(d3.axisBottom(xScaleRight).tickFormat((i) => {
			return HARD_DATA[i].Species
		})) // add tick labels for bars
		.attr("font-size", "10px");

	// set scale for y-axis for right graph
	const yScaleRight = d3.scaleLinear()
		.domain([0, 60])
		.range([VIS_HEIGHT, 0])
	// Add y-axis on right graph
	FRAME3.append("g")
		.attr('transform', "translate(" + MARGINS.left +
			"," + (MARGINS.bottom) + ")")
		.call(d3.axisLeft(yScaleRight));

	// add bars to right graph
	right = FRAME3.selectAll("bars")
		.data(HARD_DATA)
		.enter()
		.append("rect")
		.attr("x", (d, i) => {
			return MARGINS.left + xScaleRight(i)
		})
		.attr("y", (d) => {
			return MARGINS.top + yScaleRight(d.Count)
		})
		.attr("height", (d) => {
			return VIS_HEIGHT - yScaleRight(d.Count)
		})
		.attr("width", xScaleRight.bandwidth())
		.attr("class", (d) => {
			return d.Species
		});

// Add brushing
	FRAME2
		// add brushing feature
		.call(d3.brush()
			// initialize brush area
			.extent([[MARGINS.left, MARGINS.top], [FRAME_WIDTH, (FRAME_HEIGHT - MARGINS.bottom)]])
			// when brush area selection changes, trigger updateChart function below
			.on("start brush", updateChart)
		)

	// function is triggered when brush area is updated
	function updateChart(event) {
		const extent = event.selection;
		middle.classed("selected", function (d) {
			return isBrushed(extent, (MARGINS.left + xScaleMiddle(d.Sepal_Width)), (MARGINS.top + yScaleMiddle(d.Petal_Width)))
		})

		// make set of selected species to update bars
		let speciesSelected = new Set();
		// resets selected points when now selected
		if (extent === null) {
			left.classed('selected', false);
			right.classed('selected', false);
		} else {
			middle.classed("selected", (d) => {
			isSelected = isBrushed(extent, (MARGINS.left + xScaleMiddle(d.Sepal_Width)), (MARGINS.top + yScaleMiddle(d.Petal_Width)));
			if (isSelected) {
		    speciesSelected.add(d.Species);
			}
	    return isSelected});

		// update left plot style (border/opacity) via css when middle plot brushed
		left.classed("selected", (d) => isBrushed(extent, (MARGINS.left + xScaleMiddle(d.Sepal_Width)),
			(MARGINS.top + yScaleMiddle(d.Petal_Width))));

		// update right graph style (border/opacity) via css when middle plot brushed
		right.classed("selected", (d) => {
			return speciesSelected.has(d.Species);
		})
	};

};

    // is brushed function called above -- true or false, depending on selection points
    function isBrushed(brush_coords, cx, cy) {
       const x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    };


});