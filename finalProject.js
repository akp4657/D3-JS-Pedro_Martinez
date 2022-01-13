// Getting the charts and the nums to control the switching
const consensusChart = document.querySelector("#chart1");
const scatterChart = document.querySelector("#chart2");
const HoFChart = document.querySelector("#chart3");
let conNum = 0;
let scatterNum = 0;
let hofNum = 0;

// Row converters
function rowConverterConsensus(row) {
  return {
    pName: row.Name,
    eraP: parseInt(row.ERAP),
    era: parseFloat(row.ERA),
    id: row.id
  }
}

function rowConverterScatter(row) {
  return {
    pName: row.Name,
    team: row.Tm,
    era: parseFloat(row.ERA),
    eraP: parseFloat(row.ERAP),
    fip: parseFloat(row.FIP),
    soNine: parseFloat(row.SO9),
    ip: parseInt(row.IP),
    id: row.ID,
  }
}

function rowConverterHoFPitchers(row) {
  return {
    pName: row.Name,
    team: row.Tm,
    era: parseFloat(row.ERA),
    ip: parseInt(row.IP),
    war: parseFloat(row.WAR),
    id: row.ID,
  }
}

// Setting the datasets
let dataset;
let dataset2;
let dataset3;

let dataURL = "ConsensusStats-csv.csv";
let dataURL2 = "2019-pitchers-csv.csv";
let dataURL3 = "HoFPitchers-csv.csv";

// Getting the axis and the rest of the values
let conChange = 0;
let xScale, yScale, colorScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;

let scatterChange = 0;
let xScaleC, yScaleC, colorScaleC;
let xAxisC, yAxisC;
let xAxisGroupC, yAxisGroupC;

let hofChange = 0;
let xScaleP, yScaleP, colorScaleP;
let xAxisP, yAxisP;
let xAxisGroupP, yAxisGroupP;

let chart1; 
let chart2;
let chart3;

let bindKey = d=> d.pName;
let bindKeyScatterP = d => d.pName;
let bindKeyHoFP = d => d.pName;


// Chart One 
/// ERA+ AND ERA CHART
//
function makeChart1(dataset) {

  // Set the height and width
  const w = 700;
  const h = 700;

  // sort the data by hits
  dataset.sort((a,b) => a.era - b.era);

  chart1 = d3.select('#chart1')
    .attr('width', w)
    .attr('height', h);

  xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.era)])
    .rangeRound([0, w - 100]);

  yScale = d3.scaleBand()
    .domain(dataset.map(d => d.pName))
    .rangeRound([20, h-20]);

  // Make the chart itself
  chart1.selectAll('rect')
    .data(dataset, bindKey)
    .enter()
    .append('rect')
    .attr('x', 125)
    .attr('y', d => yScale(d.pName))
    .attr('width', d => xScale(d.era))
    .attr('height', 30)
    .attr('fill', '#f4f4f4')
    .call(attachConsensusBarEvents, colorScale); // attachMouseEvents

  xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale)

  // AXES
  xAxisGroup = chart1.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(125, ${h - 20})`)
    .attr('id', 'bottomAxis')
    .call(xAxis);

  yAxisGroup = chart1.append('g')
    .attr('class', 'axis-left1')
    .attr('transform', `translate(125,0 )`)
    .attr('id', 'leftAxis')
    .call(yAxis);
}


///
/// 2019 PITCHERS W/ PEDRO
///
function makeChart2(dataset) {

  // New height and sorting
  const w = 700;
  const h = 700;

  dataset.sort((a,b) => b.era - a.era);

  chart2 = d3.select('#chart2')
    .attr('width', w)
    .attr('height', h);

  xScaleC = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.era)])
    .rangeRound([80, w - 20]);

  yScaleC = d3.scaleLinear()
    .domain([d3.max(dataset, (d) => d.ip), d3.min(dataset, d => d.ip) - 10])
    .rangeRound([20, h-20]);

  // Making the chart
  chart2.selectAll('circle')
    .data(dataset, bindKeyScatterP.pName)
    .enter()
    .append('circle')
    .attr('cx', d => xScaleC(d.era))
    .attr('cy', d => yScaleC(d.ip))
    .attr('r', 5)
    .attr('fill', '#f4f4f4')
    .attr('id', d => `${d.id}`)
    .call(attach2019ScatterEvents,colorScaleC);

  xAxisC = d3.axisBottom(xScaleC);
  yAxisC = d3.axisLeft(yScaleC);

  // AXES
  xAxisGroupC = chart2.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - 20})`)
    .attr('id', 'bottomAxis')
    .call(xAxisC);

  yAxisGroupC = chart2.append('g')
    .attr('class', 'axis-left1')
    .attr('transform', `translate(80,0 )`)
    .attr('id', 'leftAxis')
    .call(yAxisC);
}


///
/// PITCHER CHART
// Cleveland line chart to show
// win percentage and ERA
///
function makeChart3(dataset) {

  const w = 700;
  const h = 700;

  dataset.sort((a,b) => a.era - b.era);

  chart3 = d3.select('#chart3')
    .attr('width', w)
    .attr('height', h);

  xScaleP = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.war)])
    .rangeRound([80, w - 20]);

  yScaleP = d3.scaleLinear()
    .domain([d3.max(dataset, (d) => d.ip), 70]) // 70 for padding
    .rangeRound([20, h-20]);

  chart3.selectAll("myline")
    .data(dataset)
    .enter()
    .append("line")
      .attr("x1", function(d) { return xScaleP(d.war); })
      .attr("x2", function(d) { return xScaleP(d.era); })
      .attr("y1", function(d) { return yScaleP(d.ip); })
      .attr("y2", function(d) { return yScaleP(d.ip); })
      .attr("stroke", "#d0e1f9")
      .attr("stroke-width", "1px")

    // Circles of variable 1
  chart3.selectAll("mycircle")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return xScaleP(d.war); })
      .attr("cy", function(d) { return yScaleP(d.ip); })
      .attr("r", "6")
      .style("fill", "#4d648d")
      .attr('id', d => `${d.id}`)
    .call(attachHoFEvents,"#4d648d", 'circlePitchersWAR');


  // Circles of variable 2
  chart3.selectAll("mycircle")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return xScaleP(d.era); })
      .attr("cy", function(d) { return yScaleP(d.ip); })
      .attr("r", "6")
      .style("fill", "#ffffff")
      .attr('id', d => `${d.id}`)
    .call(attachHoFEvents,"#ffffff", 'circlePitchersERA');


  xAxisP = d3.axisBottom(xScaleP);
  yAxisP = d3.axisLeft(yScaleP);

  // AXES
  xAxisGroupP = chart3.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, ${h - 20})`)
    .attr('id', 'bottomAxis')
    .call(xAxisP);

  yAxisGroupP = chart3.append('g')
    .attr('class', 'axis-left1')
    .attr('transform', `translate(80,0 )`)
    .attr('id', 'leftAxis')
    .call(yAxisP);
}

function attachConsensusBarEvents (sel, getColor) {
  // Selection Events
  sel
.on("mouseover", function (d) {
  // Change the hover color based on the 
  // bar value
  d3.select(this)
  .transition('hover')
  .style('fill', '#dddddd');
  
  // Update the position and value
  // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  // If the chart has changed, change the values to be correct
    if(conNum % 2 != 0) {
      d3.select("#tooltip")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .select("#value")
          .text(`${d.eraP} ERA+`);

      // Get the title of the tip and update that
      d3.select("#tooltip")
        .select("#dayValue")
          .text((d.pName));

      // Show the tooltip
      d3.select("#tooltip")
        .classed("hidden", false);
    }
    else {
      d3.select("#tooltip")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 20) + "px")
        .select("#value")
          .text(`${d.era} ERA`);

      // Get the title of the tip and update that
      d3.select("#tooltip")
        .select("#dayValue")
          .text((d.pName));

      // Show the tooltip
      d3.select("#tooltip")
        .classed("hidden", false);
    }
  })

// When we leave, put the color back and then hide the tooltip
  .on("mouseout", function (d) {
    d3.select(this)
      .transition('hover')
      .style('fill', getColor);

      d3.select('#tooltip')
      .classed('hidden', true);
  })

};

function attach2019ScatterEvents (sel, getColor) {
  // Selection Events
  sel
.on("mouseover", function (d) {


  // Change the hover color based on the 
  // bar value
  d3.select(this)
  .transition('hover')
  .style('fill', '#dddddd');
  
  // Update the position and value
  // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  // If the chart has changed, change the values to be correct
  if(scatterNum === 1) {
    console.dir("In here");
    d3.select("#tooltipScatter")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .select("#value")
        .text(`${d.eraP} ERA+`);

    // Get the title of the tip and update that
    d3.select("#tooltipScatter")
      .select("#dayValue")
        .text(`${d.pName} (${d.team})`);

    // Show the tooltip
    d3.select("#tooltipScatter")
      .classed("hidden", false);
  } else if(scatterNum === 0){
    console.dir("In here");
    d3.select("#tooltipScatter")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .select("#value")
        .text(`${d.era} ERA`);

    // Get the title of the tip and update that
    d3.select("#tooltipScatter")
      .select("#dayValue")
        .text(`${d.pName} (${d.team})`);

    // Show the tooltip
    d3.select("#tooltipScatter")
      .classed("hidden", false);
  } else if(scatterNum === 2){
    console.dir("In here");
    d3.select("#tooltipScatter")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .select("#value")
        .text(`${d.fip} FIP`);

    // Get the title of the tip and update that
    d3.select("#tooltipScatter")
      .select("#dayValue")
        .text(`${d.pName} (${d.team})`);

    // Show the tooltip
    d3.select("#tooltipScatter")
      .classed("hidden", false);
  } else{
    console.dir("In here");
    d3.select("#tooltipScatter")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .select("#value")
        .text(`${d.soNine} SO/9`);

    // Get the title of the tip and update that
    d3.select("#tooltipScatter")
      .select("#dayValue")
        .text(`${d.pName} (${d.team})`);

    // Show the tooltip
    d3.select("#tooltipScatter")
      .classed("hidden", false);
  }
  })

// When we leave, put the color back and then hide the tooltip
  .on("mouseout", function (d) {
    d3.select(this)
      .transition('hover')
      .style('fill', getColor);

    d3.select('#tooltipScatter')
    .classed('hidden', true);
  })

};

function attachHoFEvents (sel, getColor, circle) {
  // Selection Events
  sel
.on("mouseover", function (d) {
  // Change the hover color based on the 
  // bar value
  d3.select(this)
  .transition('hover')
  .style('fill', '#dddddd');
  
  // Update the position and value
  // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  // If the chart has changed, change the values to be correct
  if(circle === 'circlePitchersWAR') {

    d3.select("#tooltipLineScatter")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .select("#value")
        .text(`${d.war} WAR`);

    // Get the title of the tip and update that
    d3.select("#tooltipLineScatter")
      .select("#dayValue")
        .text(`${d.pName}`);

    // Show the tooltip
    d3.select("#tooltipLineScatter")
      .classed("hidden", false);
  } else if(circle === 'circlePitchersERA') {

    d3.select("#tooltipLineScatter")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")
      .select("#value")
        .text(`${d.era} ERA`);

    // Get the title of the tip and update that
    d3.select("#tooltipLineScatter")
      .select("#dayValue")
        .text(`${d.pName}`);

    // Show the tooltip
    d3.select("#tooltipLineScatter")
      .classed("hidden", false);
  }
  })

// When we leave, put the color back and then hide the tooltip
  .on("mouseout", function (d) {
    d3.select(this)
      .transition('hover')
      .style('fill', getColor);

      d3.select('#tooltipLineScatter')
      .classed('hidden', true);
  })

};


// Changing the bars
function changeBars () {
  if(conNum % 2 != 0) {
     // 1. re-sort the dataset
     dataset.sort((a,b) => b.eraP - a.eraP);

     // 2. update xscale domain
     xScale
       .domain([0, d3.max(dataset, d => d.eraP)]);
 
     // 3. update yscale domain
     yScale
       .domain(dataset.map(d => d.pName));

     // 4. select rects, rebind with bindkey, use transition to them
     const bars = chart1.selectAll('rect')
       .data(dataset, bindKey.pName);
     
     const trans = d3.transition()
       .duration(1000);
 
     bars.exit()
       .transition(trans)
       .remove();
 
     // update x,y, and width of bars
     bars
       .enter()
         .append('rect')
         .classed('bar', true)
         .attr('x', 600)
         .attr('y', d => yScale(d.pName))
         .attr('height', 18)
         .attr('width', 0)
       .merge(bars)
         .transition(trans)
         .attr('width', d => xScale(d.eraP))
         .attr('fill', '#d0e1f9');
 
       // After that, alway update xAxis scale, xAxisGroup with xAxis (call), and same for yAxis scale and yAxisGroup  (see 5.3 example code)
       yAxisGroup
         .transition(trans)
         .call(yAxis)
 
       xAxisGroup
         .transition(trans)
         .call(xAxis)
  }

  else {
    // 1. re-sort the dataset
    dataset.sort((a,b) => a.era - b.era);

    // 2. update xscale domain
    xScale
      .domain([0, d3.max(dataset, d => d.era)]);

    // 3. update yscale domain
    yScale
      .domain(dataset.map(d => d.pName));


    // 4. select rects, rebind with bindkey, use transition to them
    const bars = chart1.selectAll('rect')
      .data(dataset, bindKey.pName);
    
    const trans = d3.transition()
      .duration(1000);

    bars.exit()
      .transition(trans)
      .remove();

      // update x,y, and width of bars
    bars
      .enter()
        .append('rect')
        .classed('bar', true)
        .attr('x', 600)
        .attr('y', d => yScale(d.pName))
        .attr('height', 18)
        .attr('width', 0)
      .merge(bars)
        .transition(trans)
        .attr('width', d => xScale(d.era))
        .attr('fill', d => '#f4f4f4');

      // After that, alway update xAxis scale, xAxisGroup with xAxis (call), and same for yAxis scale and yAxisGroup  (see 5.3 example code)
      yAxisGroup
        .transition(trans)
        .call(yAxis)

      xAxisGroup
        .transition(trans)
        .call(xAxis)
  }
}

//Define sort function
// No need to sort the circle charts
function changeScatter() {
  if(scatterNum === 1) {
     xScaleC
       .domain([0, d3.max(dataset2, (d) => d.eraP)]);

     // No need to update the yScale either
     // 4. select rects, rebind with bindkey, use transition to them


     const circle = chart2.selectAll('circle')
       .data(dataset2, bindKeyScatterP.pName);
     
     const trans = d3.transition()
       .duration(1000);
 
     circle.exit()
       .transition(trans)
       .remove();
 
     // update x,y, and width of bars
     circle
       .enter()
         .append('circle')
         .classed('circle', true)
         .attr('cy', d => yScaleC(d.ip))
         .attr('cx', 600)
         .attr('r', 0)
       .merge(circle)
         .transition(trans)
         .attr('cx', d => xScaleC(d.eraP))
         .attr('r', 5)
         .attr('id', d => `${d.id}`)
         .attr('fill', '#d0e1f9');
 
       // After that, alway update xAxis scale, xAxisGroup with xAxis (call), and same for yAxis scale and yAxisGroup  (see 5.3 example code)
       yAxisGroupC
         .transition(trans)
         .call(yAxisC)
 
       xAxisGroupC
         .transition(trans)
         .call(xAxisC)
  }

  else if(scatterNum === 0) {
     // 2. update xscale domain
     xScaleC
       .domain([0, d3.max(dataset2, (d) => d.era)]);

     // 4. select rects, rebind with bindkey, use transition to them
     const circle = chart2.selectAll('circle')
       .data(dataset2, bindKeyScatterP.pName);
     
     const trans = d3.transition()
       .duration(1000);
 
     circle.exit()
       .transition(trans)
       .remove();
 
       // update x,y, and width of bars
     circle
       .enter()
         .append('circle')
         .classed('circle', true)
         .attr('cy', d => yScaleC(d.ip))
         .attr('cx', 600)
         .attr('r', 0)
       .merge(circle)
         .transition(trans)
         .attr('cx', d => xScaleC(d.era))
         .attr('r', 5)
         .attr('id', d => `${d.id}`)
         .attr('fill', '#ffffff');
 
       // After that, alway update xAxis scale, xAxisGroup with xAxis (call), and same for yAxis scale and yAxisGroup  (see 5.3 example code)
       yAxisGroupC
         .transition(trans)
         .call(yAxisC)
 
       xAxisGroupC
         .transition(trans)
         .call(xAxisC)
  } 
  
  else if(scatterNum === 2) {
    // 2. update xscale domain
    xScaleC
      .domain([0, d3.max(dataset2, (d) => d.fip)]);

    // 4. select rects, rebind with bindkey, use transition to them
    const circle = chart2.selectAll('circle')
      .data(dataset2, bindKeyScatterP.pName);
    
    const trans = d3.transition()
      .duration(1000);

    circle.exit()
      .transition(trans)
      .remove();

      // update x,y, and width of bars
    circle
      .enter()
        .append('circle')
        .classed('circle', true)
        .attr('cy', d => yScaleC(d.ip))
        .attr('cx', 600)
        .attr('r', 0)
      .merge(circle)
        .transition(trans)
        .attr('cx', d => xScaleC(d.fip))
        .attr('r', 5)
        .attr('id', d => `${d.id}`)
        .attr('fill', '#4d648d');

      // After that, alway update xAxis scale, xAxisGroup with xAxis (call), and same for yAxis scale and yAxisGroup  (see 5.3 example code)
      yAxisGroupC
        .transition(trans)
        .call(yAxisC)

      xAxisGroupC
        .transition(trans)
        .call(xAxisC)
 }
  else if(scatterNum === 3) {
    // 2. update xscale domain
    xScaleC
      .domain([0, d3.max(dataset2, (d) => d.soNine)]);

    // 4. select rects, rebind with bindkey, use transition to them
    const circle = chart2.selectAll('circle')
      .data(dataset2, bindKeyScatterP.pName);
    
    const trans = d3.transition()
      .duration(1000);

    circle.exit()
      .transition(trans)
      .remove();

      // update x,y, and width of bars
    circle
      .enter()
        .append('circle')
        .classed('circle', true)
        .attr('cy', d => yScaleC(d.ip))
        .attr('cx', 600)
        .attr('r', 0)
      .merge(circle)
        .transition(trans)
        .attr('cx', d => xScaleC(d.soNine))
        .attr('r', 5)
        .attr('id', d => `${d.id}`)
        .attr('fill', '#283655');

      // After that, alway update xAxis scale, xAxisGroup with xAxis (call), and same for yAxis scale and yAxisGroup  (see 5.3 example code)
      yAxisGroupC
        .transition(trans)
        .call(yAxisC)

      xAxisGroupC
        .transition(trans)
        .call(xAxisC)
        
      scatterNum = -1;
  }
}

  // Load the row converters
  window.onload = function () {
    d3.csv(dataURL, rowConverterConsensus)
      .then((_dataset) => {
        dataset = _dataset;
        makeChart1(dataset);
      });

    d3.csv(dataURL2, rowConverterScatter)
      .then((_dataset) => {
        dataset2 = _dataset;
        makeChart2(dataset2);
      });

    d3.csv(dataURL3, rowConverterHoFPitchers)
      .then((_dataset) => {
        dataset3 = _dataset;
        makeChart3(dataset3);
      });

    // Update the numbers onClick
    consensusChart.onclick = () => {
      conNum++;
    }

    scatterChart.onclick = () => {
      scatterNum++;
    }

    // When the chart is clicked, call the change methods
    consensusChart.addEventListener("click", changeBars);
    scatterChart.addEventListener("click", changeScatter);
  }